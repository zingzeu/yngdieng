import {Component, Inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {FengDocument} from 'yngdieng/shared/documents_pb';

import {IYngdiengEnvironment, YNGDIENG_ENVIRONMENT} from '../../environments/environment';
import {renderExplanation} from '../../yngdieng/explanations';
import {toMonoHanziResultViewModel} from '../common/converters';
import {YngdiengBackendService} from '../yngdieng-backend.service';
import {YngpingHelpDialogComponent} from '../yngping-help-dialog/yngping-help-dialog.component';

@Component({
  selector: 'app-details-feng',
  templateUrl: './details-feng.component.html',
  styleUrls: ['./details-feng.component.scss'],
  // TODO: FIX THIS.
  encapsulation: ViewEncapsulation.None,
})
export class DetailsFengComponent implements OnInit, OnDestroy {
  isBusy: boolean = false;
  hasError: boolean = false;
  toggleStructured: boolean = true;
  fengDoc: FengDocument;
  singleCharResults = [];

  private subscription: Subscription;
  private historicalSubscription: Subscription;

  get enableTtsAudio() {
    return this.environment.showAudioPlayerButtons;
  }

  get showToggleStructured() {
    return this.environment.structuredExplanations.enabled &&
        this.environment.structuredExplanations.showDebugToggle;
  }

  get showStructuredExplanation() {
    return this.environment.structuredExplanations.enabled && this.toggleStructured &&
        this.fengDoc != null && this.fengDoc.getExplanationStructured() != null;
  }

  get structuredExplanation() {
    return renderExplanation(
        this.fengDoc.getExplanationStructured(), this.fengDoc.getHanziCanonical());
  }

  get shouldShowSandhi() {
    return this.fengDoc.getYngpingUnderlying() !== this.fengDoc.getYngpingCanonical();
  }

  get audioUrlUnderlying() {
    return this.environment.serverUrl + '/tts/' + this.fengDoc.getYngpingUnderlying()
  }

  get audioUrlSandhi() {
    return this.environment.serverUrl + '/tts/' + this.fengDoc.getYngpingCanonical()
  }

  constructor(
      @Inject(YNGDIENG_ENVIRONMENT) private environment: IYngdiengEnvironment,
      private route: ActivatedRoute,
      private backendService: YngdiengBackendService,
      private dialog: MatDialog) {}

  onShowYngpingHelp() {
    this.dialog.open(YngpingHelpDialogComponent, {width: '80vw'});
  }

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
                              r => toMonoHanziResultViewModel(r.getHistoricalDocument()))));
            }))
            .subscribe(x => {
              this.singleCharResults = x;
            });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.historicalSubscription.unsubscribe();
  }
}
