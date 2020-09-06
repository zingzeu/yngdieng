import {Component, OnInit, OnDestroy} from '@angular/core';
import {switchMap} from 'rxjs/operators';
import {YngdiengBackendService} from '../yngdieng-backend.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {SearchV2Response} from 'yngdieng/shared/services_pb';

@Component({
  selector: 'app-search-v2-result',
  templateUrl: './search-v2-result.component.html',
  styleUrls: ['./search-v2-result.component.scss'],
})
export class SearchV2ResultComponent implements OnInit, OnDestroy {
  private resultSubscription: Subscription;
  results: SearchV2Response.SearchCard[];
  isBusy: boolean;
  isInvalidQuery: boolean;

  constructor(
    private route: ActivatedRoute,
    private backendService: YngdiengBackendService
  ) {}

  s(x: any) {
    return JSON.stringify(x.toObject());
  }
  ngOnInit(): void {
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

  ngOnDestroy(): void {
    this.resultSubscription?.unsubscribe();
  }
}
