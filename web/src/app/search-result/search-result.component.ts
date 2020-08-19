import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {SearchResultRow} from 'yngdieng/shared/services_pb';

import {AdvancedSearchQueryBuilderService} from '../advanced-search-query-builder.service';
import {toMonoHanziResultViewModel} from '../common/converters';
import {FengResultViewModel, MonoHanziResultViewModel} from '../common/view-models';
import {YngdiengBackendService} from '../yngdieng-backend.service';
import {YngdiengTitleService} from '../yngdieng-title.service';

// Keep in sync with server/backend/Services/YngdiengService.Search.cs
const PAGE_SIZE = 10;
@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
  providers: [AdvancedSearchQueryBuilderService]
})
export class SearchResultComponent implements OnInit, OnDestroy {
  queryText: any;
  isBusy: boolean = false;
  showingAdvancedOptions: boolean = false;
  results: Array<MonoHanziResultViewModel|FengResultViewModel> = [];
  computationTimeMs: number;
  isInvalidQuery: boolean = false;

  // Pagination related properties
  readonly pageSize = PAGE_SIZE;
  offset: number = 0;
  totalLength: number = 0;
  get currentPageIndex() {
    return Math.floor(this.offset / this.pageSize);
  }

  private propertiesSubscription: Subscription;
  private resultSubscription: Subscription;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private titleService: YngdiengTitleService,
      private backendService: YngdiengBackendService) {}

  ngOnInit() {
    this.isBusy = true;

    this.propertiesSubscription = this.route.paramMap.subscribe(paramMap => {
      let query = paramMap.get('query');
      this.queryText = query;
      this.offset = this.getOffsetFromParamMap(paramMap);
      this.titleService.setTitleForSearchResultPage(query);
    });
    this.resultSubscription =
        this.route.paramMap
            .pipe(switchMap(
                paramMap => {return this.backendService.search(
                    paramMap.get('query'), this.getOffsetFromParamMap(paramMap))}))
            .subscribe(
                response => {
                  this.isBusy = false;
                  this.computationTimeMs = response.getComputationTimeMs();
                  this.results = response.getResultsList().map(resultRowToViewModel);
                  this.totalLength = response.getLength();
                },
                err => {
                  this.results = [];
                  console.error(err);
                  this.isBusy = false;
                  this.isInvalidQuery = true;
                })
  }

  ngOnDestroy() {
    this.resultSubscription.unsubscribe();
    this.propertiesSubscription.unsubscribe();
  }

  private getOffsetFromParamMap(paramMap: ParamMap): number {
    let offsetStr = paramMap.get('offset');
    if (offsetStr == undefined) {
      return 0;
    }
    let tryParseResult = parseInt(offsetStr, /* radix= */ 10);
    return isNaN(tryParseResult) ? 0 : tryParseResult;
  }

  onNavigateBack() {
    this.router.navigate(['/'])
  }

  onPerformSearch(searchText: string) {
    this.redirectTo(['/search', searchText])
  }

  toggleAdvancedOptions() {
    this.showingAdvancedOptions = !this.showingAdvancedOptions;
  }

  onPageChanged(pageEvent) {
    let newPageIndex = pageEvent['pageIndex'];
    this.redirectTo(['/search', this.queryText, {'offset': this.pageSize * newPageIndex}])
  }

  private redirectTo(commands: any[]) {
    this.router.navigateByUrl('/', {skipLocationChange: true})
        .then(() => this.router.navigate(commands));
  }
}

function resultRowToViewModel(r: SearchResultRow): MonoHanziResultViewModel|FengResultViewModel {
  switch (r.getResultCase()) {
    case SearchResultRow.ResultCase.HISTORICAL_DOCUMENT:
      return toMonoHanziResultViewModel(r.getHistoricalDocument());
    case SearchResultRow.ResultCase.FENG_DOCUMENT:
      let f = r.getFengDocument();
      return {
        _type: 'feng', yngping: f.getYngpingCanonical(), hanzi: f.getHanziCanonical(),
            explanation: f.getExplanation().length > 100 ?
            f.getExplanation().substr(0, 97) + '...' :
            f.getExplanation(),
            id: f.getId(),
      }
    default:
      return null
  }
}
