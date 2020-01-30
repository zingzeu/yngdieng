import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Hanzi } from 'yngdieng/shared/documents_pb';
import {  SearchResultRow } from 'yngdieng/shared/services_pb';
import { getInitialString, getFinalString, getToneString } from "@yngdieng/utils";
import { SearchResultItemViewModel, FengResultViewModel } from '../common/view-models';
import { AdvancedSearchQueryBuilderService } from '../advanced-search-query-builder.service';
import { YngdiengBackendService } from '../yngdieng-backend.service';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

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
  results: Array<SearchResultItemViewModel | FengResultViewModel> = [];
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
    private backendService: YngdiengBackendService) { }

  ngOnInit() {

    this.isBusy = true;

    this.propertiesSubscription = this.route.paramMap
      .subscribe(
        paramMap => {
          this.queryText = paramMap.get("query");
          this.offset = this.getOffsetFromParamMap(paramMap);
        }
      );
    this.resultSubscription = this.route.paramMap.pipe(
      switchMap(paramMap => {
        return this.backendService.search(paramMap.get("query"),
          this.getOffsetFromParamMap(paramMap))
      })
    ).subscribe(
      response => {
        this.isBusy = false;
        this.computationTimeMs = response.getComputationTimeMs();
        this.results = response.getResultsList()
          .map(resultRowToViewModel);
        this.totalLength = response.getLength();
      },
      err => {
        this.results = [];
        console.error(err);
        this.isBusy = false;
        this.isInvalidQuery = true;
      }
    )
  }

  ngOnDestroy() {
    this.resultSubscription.unsubscribe();
    this.propertiesSubscription.unsubscribe();
  }

  private getOffsetFromParamMap(paramMap: ParamMap): number {
    let offsetStr = paramMap.get("offset");
    if (offsetStr == undefined) {
      return 0;
    }
    let tryParseResult = parseInt(offsetStr, /* radix= */10);
    return isNaN(tryParseResult) ? 0 : tryParseResult;
  }

  onNavigateBack() {
    this.router.navigate(["/"])
  }

  onPerformSearch(searchText: string) {
    this.redirectTo(["/search", searchText])
  }

  toggleAdvancedOptions() {
    this.showingAdvancedOptions = !this.showingAdvancedOptions;
  }

  onPageChanged(pageEvent) {
    let newPageIndex = pageEvent["pageIndex"];
    this.redirectTo(["/search", this.queryText, { 'offset': this.pageSize * newPageIndex }])
  }

  private redirectTo(commands: any[]) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(commands));
  }

}

function resultRowToViewModel(r: SearchResultRow): SearchResultItemViewModel | FengResultViewModel {
  switch (r.getResultCase()) {
    case SearchResultRow.ResultCase.DOCUMENT:
      let d = r.getDocument();
      return {
        _type: 'single',
        hanziCanonical: getHanziString(d.getHanziCanonical()),
        hanziAlternatives: d.getHanziAlternativesList().map(getHanziString),
        buc: d.getBuc(),
        initial: getInitialString(d.getInitial()),
        final: getFinalString(d.getFinal()),
        tone: getToneString(d.getTone()),
        ciklinSource: d.getDfdId() > 0 ? null : "戚林",
        dfdSource: d.getDfdId() > 0 ? "DFD " + d.getDfd().getPageNumber() + " 页" : null,
      } as SearchResultItemViewModel;
    case SearchResultRow.ResultCase.AGGREGATED_DOCUMENT:
      let a = r.getAggregatedDocument();
      return {
        _type: 'single',
        hanziCanonical: getHanziString(a.getHanziCanonical()),
        hanziAlternatives: a.getHanziAlternativesList().map(getHanziString),
        buc: a.getBuc(),
        initial: getInitialString(a.getInitial()),
        final: getFinalString(a.getFinal()),
        tone: getToneString(a.getTone()),
        ciklinSource: a.hasCiklinSource() ? "戚林" : null,
        dfdSource: a.hasDfdSource() ? "DFD " + a.getDfdSource().getPageNumber() + " 页" : null,
      }
    case SearchResultRow.ResultCase.FENG_DOCUMENT:
      let f = r.getFengDocument();
      return {
        _type: "feng",
        yngping: f.getYngpingCanonical(),
        hanzi: f.getHanziCanonical(),
        explanation: f.getExplanation().length > 100 ? f.getExplanation().substr(0, 97) + '...' : f.getExplanation(),
        id: f.getId(),
      }
    default:
      return null
  }
}

function getHanziString(h: Hanzi): string {
  if (h.hasRegular()) {
    return h.getRegular();
  }
  return h.getIds();
}