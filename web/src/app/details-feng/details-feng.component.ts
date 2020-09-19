import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {FengDocument} from 'yngdieng/shared/documents_pb';

import {toMonoHanziResultViewModel} from '../common/converters';
import {
  WordDetailsHeroModel,
  WordPronunication,
} from '../word-details-hero/word-details-hero.component';
import {YngdiengBackendService} from '../yngdieng-backend.service';
import {YngdiengTitleService} from '../yngdieng-title.service';

@Component({
  selector: 'app-details-feng',
  templateUrl: './details-feng.component.html',
  styleUrls: ['./details-feng.component.scss'],
})
export class DetailsFengComponent implements OnInit, OnDestroy {
  isBusy: boolean = false;
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
    this.isBusy = true;

    let currentDocument$: Observable<FengDocument> = this.route.paramMap.pipe(
      map(paramMap => paramMap.get('id')),
      switchMap(docId => this.backendService.getFengDocument(docId))
    );
    this.subscription = currentDocument$.subscribe(
      response => {
        this.isBusy = false;
        this.hasError = false;
        this.fengDoc = response;
        this.titleService.setTitleForDetailsPage(response.getHanziCanonical());
      },
      _err => {
        this.isBusy = false;
        this.hasError = true;
      }
    );
    this.historicalSubscription = currentDocument$
      .pipe(
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
