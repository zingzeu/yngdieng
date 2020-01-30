import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { YngdiengBackendService } from '../yngdieng-backend.service';
import { getHanziString } from '../common/hanzi-util';
import { getInitialString, getFinalString, getToneString } from 'yngdieng/web/src/yngdieng/utils';
import { Subscription } from 'rxjs';

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
  moreHomophonesQuery: string = "";

  private currentDocumentSubscription: Subscription;
  private homophonesSubscription: Subscription;
  private vocabSubscription: Subscription;

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private backendService: YngdiengBackendService) { }

  ngOnInit() {
    this.isBusy = true;
    let currentDocument$ = this.route.paramMap.pipe(
      switchMap(paramMap =>
        this.backendService.getAggregatedDocument(paramMap.get("id")))
    );
    this.currentDocumentSubscription = currentDocument$
      .subscribe(
        response => {
          this.isBusy = false;
          this.hasError = false;
          this.vm = {
            hanziCanonical: getHanziString(response.getHanziCanonical()),
            hanziAlternatives: response.getHanziAlternativesList().map(h => getHanziString(h)),
            fanqie: getInitialString(response.getInitial())
              + getFinalString(response.getFinal()) + " "
              + getToneString(response.getTone()),
            buc: response.getBuc(),
            sources: []
          };
          if (response.hasCiklinSource()) {
            this.vm.sources.push("戚林八音校注");
          }
          if (response.hasDfdSource()) {
            this.vm.sources.push("Dictionary of Foochow Dialect "
              + response.getDfdSource().getPageNumber() + " 页")
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
        }
      );


    this.homophonesSubscription = currentDocument$.pipe(
      switchMap(a => {
        let initial = getInitialString(a.getInitial());
        let final = getFinalString(a.getFinal());
        let tone = getToneString(a.getTone());
        return this.backendService.search(
          `i:${initial} f:${final} t:${tone}`
        )
      }),
      map(response =>
        response.getResultsList().filter(x => x.hasAggregatedDocument())
          .map(d => {
            return {
              hanzi: getHanziString(d.getAggregatedDocument().getHanziCanonical()),
              id: d.getAggregatedDocument().getId()
            } as Homophone;
          })
          .filter(x => x.id != this.route.snapshot.paramMap.get("id")))
    ).subscribe(x => {
      this.homophones = x;
    });

    this.vocabSubscription = currentDocument$
      .pipe(
        switchMap(a => this.backendService.search(getHanziString(a.getHanziCanonical()))),
        map(response => 
          response.getResultsList()
          .filter(x => x.hasFengDocument())
          .map(d => d.getFengDocument())
          .map(f => {
            return {
              id: f.getId(),
              hanzi: f.getHanziCanonical(),
              yngping: f.getYngpingCanonical(),
              explanation: f.getExplanation()//todo: trim
            } as Vocab;
          })
        )
      )
      .subscribe(x => {
        this.vocabs = x;
      });

  }

  ngOnDestroy() {
    this.currentDocumentSubscription.unsubscribe();
    this.homophonesSubscription.unsubscribe();
    this.vocabSubscription.unsubscribe();
  }

  onBackClicked() {
    this.location.back();
  }

  onHomophoneClicked(id: string) {
    this.router.navigate(["/char", id])
  }

  onMoreHomophonesClicked() {
    this.router.navigate(["/search", this.moreHomophonesQuery])
  }

}

interface Homophone {
  hanzi: string,
  id: string
}

interface Vocab {
  yngping: string,
  hanzi: string,
  explanation: string,
  id: string,
}

interface DetailsMonoHanziViewModel {
  hanziCanonical: string,
  hanziAlternatives: string[],
  fanqie: string,
  // TODO: yngping
  buc: string,
  sources: string[]
}