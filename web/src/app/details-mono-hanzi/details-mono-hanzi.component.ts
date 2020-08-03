import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {getFinalString, getInitialString, getToneString} from 'yngdieng/web/src/yngdieng/utils';

import {getHanziString} from '../common/hanzi-util';
import {YngdiengBackendService} from '../yngdieng-backend.service';
import {YngdiengTitleService} from '../yngdieng-title.service';

@Component({
  selector: 'app-details-mono-hanzi',
  templateUrl: './details-mono-hanzi.component.html',
  styleUrls: ['./details-mono-hanzi.component.scss']
})
export class DetailsMonoHanziComponent implements OnInit, OnDestroy {
  isBusy = false;
  hasError = false;
  vm: DetailsMonoHanziViewModel;
  homophones: Homophone[];
  vocabs: Vocab[];
  moreHomophonesQuery: string = '';

  private currentDocumentSubscription: Subscription;
  private homophonesSubscription: Subscription;
  private vocabSubscription: Subscription;

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private titleService: YngdiengTitleService,
      private backendService: YngdiengBackendService) {}

  ngOnInit() {
    this.isBusy = true;
    let currentDocument$ = this.route.paramMap.pipe(
        switchMap(paramMap => this.backendService.getHistoricalDocument(paramMap.get('id'))));
    this.currentDocumentSubscription = currentDocument$.subscribe(
        response => {
          this.isBusy = false;
          this.hasError = false;
          this.vm = {
            hanziCanonical: getHanziString(response.getHanziCanonical()),
            hanziAlternatives: response.getHanziAlternativesList().map(h => getHanziString(h)),
            fanqie: getInitialString(response.getInitial()) + getFinalString(response.getFinal()) +
                ' ' + getToneString(response.getTone()),
            yngping: response.getYngping(),
            sources: []
          };
          this.titleService.setTitleForDetailsPage(this.vm.hanziCanonical);
          if (response.hasCiklinSource()) {
            this.vm.sources.push('戚林八音校注');
          }
          if (response.hasDfdSource()) {
            this.vm.sources.push(
                'Dictionary of Foochow Dialect ' + response.getDfdSource().getPageNumber() + ' 页')
          }

          let initial = getInitialString(response.getInitial());
          let final = getFinalString(response.getFinal());
          let tone = getToneString(response.getTone());
          this.moreHomophonesQuery = `i:${initial} f:${final} t:${tone}`;
        },
        err => {
          this.isBusy = false;
          this.hasError = true;
          console.error(err);
        });

    this.homophonesSubscription =
        currentDocument$
            .pipe(
                switchMap(a => {
                  let initial = getInitialString(a.getInitial());
                  let final = getFinalString(a.getFinal());
                  let tone = getToneString(a.getTone());
                  return this.backendService.search(`i:${initial} f:${final} t:${tone}`)
                }),
                map(response => response.getResultsList()
                                    .filter(x => x.hasHistoricalDocument())
                                    .map(d => {
                                      return {
                                        hanzi: getHanziString(
                                            d.getHistoricalDocument().getHanziCanonical()),
                                        id: d.getHistoricalDocument().getId()
                                      } as Homophone;
                                    })
                                    .filter(x => x.id != this.route.snapshot.paramMap.get('id'))))
            .subscribe(x => {
              this.homophones = x;
            });

    this.vocabSubscription =
        currentDocument$
            .pipe(switchMap(
                a => this.backendService.search(getHanziString(a.getHanziCanonical()))
                         .pipe(
                             map(response => response.getResultsList()
                                                 .filter(x => x.hasFengDocument())
                                                 .map(d => d.getFengDocument())
                                                 .map(f => {
                                                   return {
                                                     id: f.getId(),
                                                     hanzi: f.getHanziCanonical(),
                                                     yngping: f.getYngpingCanonical(),
                                                     explanation: f.getExplanation()  // todo: trim
                                                   } as Vocab;
                                                 })
                                                 .filter(
                                                     v => v.hanzi.indexOf(getHanziString(
                                                              a.getHanziCanonical())) >= 0))),
                ))
            .subscribe(x => {
              this.vocabs = x;
            });
  }

  ngOnDestroy() {
    this.currentDocumentSubscription.unsubscribe();
    this.homophonesSubscription.unsubscribe();
    this.vocabSubscription.unsubscribe();
  }

  onHomophoneClicked(id: string) {
    this.router.navigate(['/char', id])
  }

  onMoreHomophonesClicked() {
    this.router.navigate(['/search', this.moreHomophonesQuery])
  }

  onMoreVocabClicked() {
    this.router.navigate(['/search', this.vm.hanziCanonical])
  }
}

interface Homophone {
  hanzi: string, id: string
}

interface Vocab {
  yngping: string, hanzi: string, explanation: string, id: string,
}

interface DetailsMonoHanziViewModel {
  hanziCanonical: string, hanziAlternatives: string[], fanqie: string, yngping: string,
      sources: string[]
}