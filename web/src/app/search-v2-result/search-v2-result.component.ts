import {Component, OnInit, OnDestroy} from '@angular/core';
import {switchMap} from 'rxjs/operators';
import {YngdiengBackendService} from '../yngdieng-backend.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchV2Response} from 'yngdieng/shared/services_pb';
import {YngdiengTitleService} from '../yngdieng-title.service';

@Component({
  selector: 'app-search-v2-result',
  templateUrl: './search-v2-result.component.html',
  styleUrls: ['./search-v2-result.component.scss'],
})
export class SearchV2ResultComponent implements OnInit, OnDestroy {
  private resultSubscription: Subscription;
  queryText: string;
  results: SearchV2Response.SearchCard[];
  isBusy: boolean;
  isInvalidQuery: boolean;
  propertiesSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: YngdiengTitleService,
    private backendService: YngdiengBackendService
  ) {}

  s(x: any) {
    return JSON.stringify(x.toObject());
  }
  ngOnInit(): void {
    this.isBusy = true;
    this.propertiesSubscription = this.route.paramMap.subscribe(paramMap => {
      let query = paramMap.get('query');
      this.queryText = query;
      this.titleService.setTitleForSearchResultPage(query);
    });
    this.resultSubscription = this.route.paramMap
      .pipe(
        switchMap(paramMap => {
          return this.backendService.searchV2(paramMap.get('query'), '');
        })
      )
      .subscribe(
        response => {
          this.isBusy = false;
          this.results = response.getResultCardsList();
        },
        err => {
          this.results = [];
          console.error(err);
          this.isBusy = false;
          this.isInvalidQuery = true;
        }
      );
  }

  onNavigateBack() {
    this.router.navigate(['/']);
  }

  onPerformSearch(searchText: string) {
    this.redirectTo(['/search2', searchText]);
  }

  ngOnDestroy(): void {
    this.resultSubscription?.unsubscribe();
    this.propertiesSubscription?.unsubscribe();
  }

  private redirectTo(commands: any[]) {
    this.router
      .navigateByUrl('/', {skipLocationChange: true})
      .then(() => this.router.navigate(commands));
  }
}
