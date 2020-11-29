import {Component, OnInit, Input, Inject} from '@angular/core';
import {SearchV2Response} from 'yngdieng/shared/services_pb';
import {
  YNGDIENG_ENVIRONMENT,
  IYngdiengEnvironment,
} from '../../environments/environment';
import {flatten} from '../richtext-flatten.pipe';

@Component({
  selector: 'app-word-card',
  templateUrl: './word-card.component.html',
  styleUrls: ['./word-card.component.scss'],
})
export class WordCardComponent implements OnInit {
  @Input('card') card: SearchV2Response.SearchCard.WordCard;

  constructor(
    @Inject(YNGDIENG_ENVIRONMENT) private environment: IYngdiengEnvironment
  ) {}

  get audioUrl() {
    return (
      this.environment.serverUrl + '/tts/' + flatten(this.card.getYngping())
    );
  }

  ngOnInit(): void {}
}
