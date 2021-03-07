import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {filter, map, switchMap} from 'rxjs/operators';
import {FengDocument} from 'yngdieng/shared/documents_pb';
import {
  YNGDIENG_ENVIRONMENT,
  IYngdiengEnvironment,
} from '../../environments/environment';
import {toMonoHanziResultViewModel} from '../common/converters';
import {
  WordDetailsHeroModel,
  WordPronunciation,
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
  heroModel: WordDetailsHeroModel;
  singleCharResults = [];

  private subscription: Subscription;
  private historicalSubscription: Subscription;
  largeScreen$: any;

  constructor(
    @Inject(YNGDIENG_ENVIRONMENT) private environment: IYngdiengEnvironment,
    private route: ActivatedRoute,
    private titleService: YngdiengTitleService,
    private backendService: YngdiengBackendService,
    private breakpointObserver: BreakpointObserver
  ) {}

  private getHeroModel(fengDoc: FengDocument): WordDetailsHeroModel {
    let shouldShowSandhi =
      fengDoc.getYngpingCanonical() !== '' &&
      fengDoc.getYngpingCanonical() !== fengDoc.getYngpingUnderlying();
    let prons = shouldShowSandhi
      ? [
          new WordPronunciation(
            '市区单字',
            fengDoc.getYngpingUnderlying(),
            this.getTtsUrl(fengDoc.getYngpingUnderlying())
          ),
          new WordPronunciation(
            '市区连读',
            fengDoc.getYngpingCanonical(),
            this.getTtsUrl(fengDoc.getYngpingCanonical())
          ),
        ]
      : [
          new WordPronunciation(
            '福州市区',
            fengDoc.getYngpingUnderlying(),
            this.getTtsUrl(fengDoc.getYngpingUnderlying())
          ),
        ];
    return new WordDetailsHeroModel(fengDoc.getHanziCanonical(), '', prons);
  }

  private getTtsUrl(yngping: string): string {
    return this.environment.serverUrl + '/tts/' + yngping;
  }

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
        this.heroModel = this.getHeroModel(result.fengDoc);
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
    this.largeScreen$ = this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .pipe(map(state => state.matches));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.historicalSubscription.unsubscribe();
  }
}
