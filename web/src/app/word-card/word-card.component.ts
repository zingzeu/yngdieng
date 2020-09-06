import {Component, OnInit, Input} from '@angular/core';
import {SearchV2Response} from 'yngdieng/shared/services_pb';

@Component({
  selector: 'app-word-card',
  templateUrl: './word-card.component.html',
  styleUrls: ['./word-card.component.scss'],
})
export class WordCardComponent implements OnInit {
  @Input('card') card: SearchV2Response.SearchCard.WordCard;

  constructor() {}

  ngOnInit(): void {}
}
