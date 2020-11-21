import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {filter, map, switchMap} from 'rxjs/operators';
import {FengDocument} from '../../../../shared/documents_pb';

import {toMonoHanziResultViewModel} from '../common/converters';
import {
  WordDetailsHeroModel,
  WordPronunication,
} from '../word-details-hero/word-details-hero.component';
import {YngdiengBackendService} from '../yngdieng-backend.service';
import {YngdiengTitleService} from '../yngdieng-title.service';
import {FengResolveResult} from './feng-resolver.service';

@Component({
  selector: 'app-details-feng',
  templateUrl: './details-feng.component.html',
  styleUrls: ['./details-feng.component.scss'],
})
export class DetailsFengComponent implements OnInit, OnDestroy {
  hasError: boolean = false;
  fengDoc: FengDocument;
  singleCharResults = [];

  private subscription: Subscription;
  private historicalSubscription: Subscription;

  get heroModel() {
    return new WordDetailsHeroModel(
      this.fengDoc.getHanziCanonical(),
      new WordPronunication(
        this.fengDoc.getYngpingUnderlying(),
        this.fengDoc.getYngpingCanonical()
      )
    );
  }

  constructor(
    private route: ActivatedRoute,
    private titleService: YngdiengTitleService,
    private backendService: YngdiengBackendService
  ) {}

  ngOnInit() {
    let resolveResult$: Observable<FengResolveResult> = this.route.data.pipe(
      map(data => data.fengResolveResult)
    );
    this.subscription = resolveResult$.subscribe(result => {
      if (result.error) {
        this.hasError = true;
      } else {
        this.hasError = false;
        this.fengDoc = result.fengDoc;
        this.titleService.setTitleForDetailsPage(
          this.fengDoc.getHanziCanonical()
        );
      }
    });
    this.historicalSubscription = resolveResult$
      .pipe(
        filter(r => !r.error),
        map(r => r.fengDoc),
        switchMap(d => {
          if (d.getHanziCanonical().length > 1) {
            return [];
          }
          return this.backendService
            .search(`${d.getHanziCanonical()} historical:only`)
            .pipe(
              map(response =>
                response
                  .getResultsList()
                  .map(r =>
                    toMonoHanziResultViewModel(r.getHistoricalDocument())
                  )
              )
            );
        })
      )
      .subscribe(x => {
        this.singleCharResults = x;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.historicalSubscription.unsubscribe();
  }
}
