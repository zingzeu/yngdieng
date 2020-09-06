import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-generic-message-card',
  templateUrl: './generic-message-card.component.html',
  styleUrls: ['./generic-message-card.component.scss'],
})
export class GenericMessageCardComponent implements OnInit {
  @Input('message') message: string;
  constructor() {}

  ngOnInit(): void {}
}
