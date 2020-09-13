import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-loading-card',
  templateUrl: './loading-card.component.html',
  styleUrls: ['./loading-card.component.scss'],
})
export class LoadingCardComponent implements OnInit {
  @Output() reload = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit(): void {}

  onNextClicked() {
    this.reload.emit(true);
  }
}
