import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {MonoHanziResultViewModel} from '../common/view-models';

@Component({
  selector: 'app-mono-hanzi-result',
  templateUrl: './mono-hanzi-result.component.html',
  styleUrls: ['./mono-hanzi-result.component.scss']
})
export class MonoHanziResultComponent implements OnInit {
  @Input('document') document: MonoHanziResultViewModel;
  get documentSource() {
    return [this.document.ciklinSource, this.document.dfdSource]
        .filter(x => x !== null && x.length > 0)
        .join('，');
  }

  constructor(private router: Router) {}

  ngOnInit() {}

  onDetailsClicked() {
    this.router.navigate(['/char', this.document.id])
  }
}
