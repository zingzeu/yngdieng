import {Location} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {FengDocument} from 'yngdieng/shared/documents_pb';

import {toMonoHanziResultViewModel} from '../common/converters';
import {YngdiengBackendService} from '../yngdieng-backend.service';

@Component({
  selector: 'app-details-feng',
  templateUrl: './details-feng.component.html',
  styleUrls: ['./details-feng.component.scss']
})
export class DetailsFengComponent implements OnInit, OnDestroy {
  isBusy: boolean = false;
  hasError: boolean = false;
  fengDoc: FengDocument;
  singleCharResults = [];

  private subscription: Subscription;
  private historicalSubscription: Subscription;

  constructor(
      private route: ActivatedRoute,
      private location: Location,
      private backendService: YngdiengBackendService) {}

  ngOnInit() {
    this.isBusy = true;

    let currentDocument$: Observable<FengDocument> = this.route.paramMap.pipe(
        map(paramMap => paramMap.get('id')),
        switchMap(docId => this.backendService.getFengDocument(docId)));
    this.subscription = currentDocument$.subscribe(
        (response) => {
          this.isBusy = false;
          this.hasError = false;
          this.fengDoc = response;
        },
        (err) => {
          this.isBusy = false;
          this.hasError = true;
        });
    this.historicalSubscription =
        currentDocument$
            .pipe(switchMap(d => {
              if (d.getHanziCanonical().length > 1) {
                return []
              }
              return this.backendService.search(`${d.getHanziCanonical()} historical:only`)
                  .pipe(
                      map(response => response.getResultsList().map(
                              r => toMonoHanziResultViewModel(r.getAggregatedDocument()))));
            }))
            .subscribe(x => {
              this.singleCharResults = x;
            });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.historicalSubscription.unsubscribe();
  }

  onBackClicked() {
    this.location.back();
  }

}
