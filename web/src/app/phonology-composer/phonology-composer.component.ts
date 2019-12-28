import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Initial, Final, Tone } from "../yngdieng/phonology_pb";
import { getInitialString, getFinalString, getToneString } from '../yngdieng/utils';

@Component({
  selector: 'app-phonology-composer',
  templateUrl: './phonology-composer.component.html',
  styleUrls: ['./phonology-composer.component.scss']
})
export class PhonologyComposerComponent implements OnInit {

  @Output() initialSelected = new EventEmitter<string>();
  @Output() finalSelected = new EventEmitter<string>();
  @Output() toneSelected = new EventEmitter<string>();
  showInitials: boolean = true;
  showFinals: boolean = true;
  showTones: boolean = true;
  initials: string[] = [];
  finals: string[] = [];
  tones: string[] = [];

  constructor() { }

  ngOnInit() {
    this.initials = Object.keys(Initial).map(i => getInitialString(Initial[i])).filter(s => s);
    this.finals = Object.keys(Final).map(i => getFinalString(Final[i])).filter(s => s);
    this.tones = Object.keys(Tone).map(i => getToneString(Tone[i])).filter(s => s);
  }

  onSelectInitial(i: string) {
    this.showInitials = false;
    this.initialSelected.emit(i);
  }

  onSelectFinal(f: string) {
    this.showFinals = false;
    this.finalSelected.emit(f);
  }

  onSelectTone(t: string) {
    this.showTones = false;
    this.toneSelected.emit(t);
  }

  clearInitial(){
    this.showInitials = true;
  }

  clearFinal(){
    this.showFinals = true;
  }

  clearTone(){
    this.showTones = true;
  }
}
