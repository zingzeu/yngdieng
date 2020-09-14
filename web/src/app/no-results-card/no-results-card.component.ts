import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-no-results-card',
  templateUrl: './no-results-card.component.html',
  styleUrls: ['./no-results-card.component.scss'],
})
export class NoResultsCardComponent implements OnInit {
  @Input('queryText') queryText: string;

  constructor() {}

  ngOnInit(): void {}
}
