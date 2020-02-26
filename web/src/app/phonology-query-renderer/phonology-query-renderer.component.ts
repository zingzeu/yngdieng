import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-phonology-query-renderer',
  templateUrl: './phonology-query-renderer.component.html',
  styleUrls: ['./phonology-query-renderer.component.scss']
})
export class PhonologyQueryRendererComponent implements OnInit {
  @Input('initial') initial: string|null;
  @Input('final') final: string|null;
  @Input('tone') tone: string|null;
  @Output() clearInitial = new EventEmitter();
  @Output() clearFinal = new EventEmitter();
  @Output() clearTone = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onClearInitial() {
    this.clearInitial.emit(null);
  }

  onClearFinal() {
    this.clearFinal.emit(null);
  }

  onClearTone() {
    this.clearTone.emit(null);
  }
}
