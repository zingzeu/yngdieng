import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {FengResultViewModel} from '../common/view-models';

@Component({
  selector: 'app-feng-result',
  templateUrl: './feng-result.component.html',
  styleUrls: ['./feng-result.component.scss']
})
export class FengResultComponent implements OnInit {
  constructor(private router: Router) {}
  @Input('document') document: FengResultViewModel;

  ngOnInit() {}

  onClick(fengDocId: string) {
    this.router.navigate(['/feng', fengDocId])
  }
}
