import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-loading-card',
  templateUrl: './loading-card.component.html',
  styleUrls: ['./loading-card.component.scss'],
})
export class LoadingCardComponent implements OnInit {
  @Output() reload = new EventEmitter<boolean>();
  clicked = false;
  constructor() {}

  ngOnInit(): void {}

  onNextClicked() {
    this.clicked = true;
    this.reload.emit(true);
  }
}
