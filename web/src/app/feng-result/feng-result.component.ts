import { Component, OnInit, Input } from '@angular/core';
import { FengResultViewModel } from '../common/view-models';

@Component({
  selector: 'app-feng-result',
  templateUrl: './feng-result.component.html',
  styleUrls: ['./feng-result.component.scss']
})
export class FengResultComponent implements OnInit {

  constructor() { }
  @Input("document") document: FengResultViewModel;

  ngOnInit() {
  }

}
