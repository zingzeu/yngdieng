import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {getFinalString, getInitialString, getToneString} from '@yngdieng/utils';
import {Subscription} from 'rxjs';
import {Final, Initial, Tone} from 'yngdieng/shared/phonology_pb';

import {AdvancedSearchQueryBuilderService} from '../advanced-search-query-builder.service';

@Component({
  selector: 'app-phonology-composer',
  templateUrl: './phonology-composer.component.html',
  styleUrls: ['./phonology-composer.component.scss']
})
export class PhonologyComposerComponent implements OnInit, OnDestroy {
  showInitials: boolean = true;
  showFinals: boolean = true;
  showTones: boolean = true;
  initials: string[] = [];
  finals: string[] = [];
  tones: string[] = [];

  private finalSubscription: Subscription;
  private initialSubscription: Subscription;
  private toneSubscription: Subscription;

  constructor(private asqbService: AdvancedSearchQueryBuilderService) {
    this.initialSubscription =
        asqbService.selectedInitial$.subscribe(i => {this.showInitials = i === null});
    this.finalSubscription =
        asqbService.selectedFinal$.subscribe(f => {this.showFinals = f === null});
    this.toneSubscription = asqbService.selectedTone$.subscribe(t => {this.showTones = t === null})
  }

  ngOnDestroy() {
    this.initialSubscription.unsubscribe();
    this.finalSubscription.unsubscribe();
    this.toneSubscription.unsubscribe();
  }

  ngOnInit() {
    this.initials = Object.keys(Initial).map(i => getInitialString(Initial[i])).filter(s => s);
    this.finals = Object.keys(Final).map(i => getFinalString(Final[i])).filter(s => s);
    this.tones = Object.keys(Tone).map(i => getToneString(Tone[i])).filter(s => s);
  }

  onSelectInitial(i: string) {
    this.asqbService.selectInitial(i);
  }

  onSelectFinal(f: string) {
    this.asqbService.selectFinal(f);
  }

  onSelectTone(t: string) {
    this.asqbService.selectTone(t);
  }
}
