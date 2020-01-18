import { Component, OnInit, Input } from '@angular/core';
import { SearchResultItemViewModel } from '../common/view-models';

@Component({
  selector: 'app-single-char-result',
  templateUrl: './single-char-result.component.html',
  styleUrls: ['./single-char-result.component.scss']
})
export class SingleCharResultComponent implements OnInit {

  @Input("document") document: SearchResultItemViewModel;

  constructor() { }

  ngOnInit() {
  }

}
