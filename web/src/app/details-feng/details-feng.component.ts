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
  largeScreen$: any;

  constructor(
    @Inject(YNGDIENG_ENVIRONMENT) private environment: IYngdiengEnvironment,
    private route: ActivatedRoute,
    private titleService: YngdiengTitleService,
    private backendService: YngdiengBackendService,
    private breakpointObserver: BreakpointObserver
  ) {}

  get heroModel() {
    let shouldShowSandhi =
      this.fengDoc.getYngpingCanonical() !== '' &&
      this.fengDoc.getYngpingCanonical() !==
        this.fengDoc.getYngpingUnderlying();
    let prons = shouldShowSandhi
      ? [
          new WordPronunication(
            '市区单字',
            this.fengDoc.getYngpingUnderlying(),
            this.getTtsUrl(this.fengDoc.getYngpingUnderlying())
          ),
          new WordPronunication(
            '市区连读',
            this.fengDoc.getYngpingCanonical(),
            this.getTtsUrl(this.fengDoc.getYngpingCanonical())
          ),
        ]
      : [
          new WordPronunication(
            '福州市区',
            this.fengDoc.getYngpingUnderlying(),
            this.getTtsUrl(this.fengDoc.getYngpingUnderlying())
          ),
        ];
    return new WordDetailsHeroModel(
      this.fengDoc.getHanziCanonical(),
      '',
      prons
    );
  }

  private getTtsUrl(yngping: string): string {
    return this.environment.serverUrl + '/tts/' + yngping;
  }

  ngOnInit() {
    let resolveResult$: Observable<FengResolveResult> = this.route.data.pipe(
      map(data => data.fengResolveResult)
    );
    this.subscription = resolveResult$.subscribe(result => {
      console.log(result);
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
    this.largeScreen$ = this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .pipe(map(state => state.matches));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.historicalSubscription.unsubscribe();
  }
}
