import {Component, OnInit, OnDestroy} from '@angular/core';
import {switchMap} from 'rxjs/operators';
import {YngdiengBackendService} from '../yngdieng-backend.service';
import {Subscription, BehaviorSubject, Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchV2Response} from 'yngdieng/shared/services_pb';
import {YngdiengTitleService} from '../yngdieng-title.service';

@Component({
  selector: 'app-search-v2-result',
  templateUrl: './search-v2-result.component.html',
  styleUrls: ['./search-v2-result.component.scss'],
  // TODO: keep scroll position
})
export class SearchV2ResultComponent implements OnInit, OnDestroy {
  private resultSubscription: Subscription;
  queryText: string;
  results: SearchV2Response.SearchCard[] = [];
  isInvalidQuery: boolean;
  propertiesSubscription: Subscription;
  dataService: SearchDataService;

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
    this.propertiesSubscription = this.route.paramMap.subscribe(paramMap => {
      let query = paramMap.get('query');
      this.dataService = new SearchDataService(this.backendService, query);
      this.resultSubscription?.unsubscribe();
      this.resultSubscription = this.dataService.resultCards$.subscribe(s => {
        this.results = s;
      });
      this.queryText = query;
      this.titleService.setTitleForSearchResultPage(query);
    });
  }

  onNavigateBack() {
    this.router.navigate(['/']);
  }

  onPerformSearch(searchText: string) {
    this.redirectTo(['/search2', searchText]);
  }

  onLoadNext() {
    this.dataService?.fetchNextPage();
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

class SearchDataService {
  // TODO: cache results
  private nextPageToken = null;
  private cardsSubject = new BehaviorSubject<SearchV2Response.SearchCard[]>([]);
  private isBusySubject = new BehaviorSubject<boolean>(false);
  private hasErrorSubject = new BehaviorSubject<boolean>(false);
  private cards: SearchV2Response.SearchCard[] = [];

  constructor(
    private backendService: YngdiengBackendService,
    private queryText: string
  ) {
    this.fetchNextPage();
  }

  fetchNextPage() {
    if (this.isBusySubject.getValue()) {
      console.log(
        'skipping fetchNextPage because a request is already in-flight.'
      );
      return;
    }
    this.isBusySubject.next(true);
    console.log('SearchDataService', this.queryText, this.nextPageToken);
    let nextPageSubscription = this.backendService
      .searchV2(this.queryText, this.nextPageToken || '')
      .subscribe(
        response => {
          this.cards = this.cards.concat(response.getResultCardsList());
          this.nextPageToken = response.getNextPageToken();
          this.cardsSubject.next(this.toCardsShown());
          this.isBusySubject.next(false);
          this.hasErrorSubject.next(false);
          nextPageSubscription.unsubscribe();
        },
        err => {
          console.error(err);
          this.hasErrorSubject.next(true);
          this.isBusySubject.next(false);
          nextPageSubscription.unsubscribe();
        }
      );
  }

  get resultCards$(): Observable<SearchV2Response.SearchCard[]> {
    return this.cardsSubject.asObservable();
  }

  get isBusy$(): Observable<boolean> {
    return this.isBusySubject.asObservable();
  }

  get hasError$(): Observable<boolean> {
    return this.hasErrorSubject.asObservable();
  }

  private toCardsShown() {
    if (this.nextPageToken === '') {
      // last page
      return this.cards;
    } else {
      var loadingCard = new SearchV2Response.SearchCard();
      loadingCard.setIsLoading(true);
      return this.cards.concat([loadingCard]);
    }
  }
}
