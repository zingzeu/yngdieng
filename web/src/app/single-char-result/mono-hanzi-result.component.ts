import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {MonoHanziResultViewModel} from '../common/view-models';

@Component({
  selector: 'app-single-char-result',
  templateUrl: './single-char-result.component.html',
  styleUrls: ['./single-char-result.component.scss']
})
export class MonoHanziResultComponent implements OnInit {
  @Input('document') document: MonoHanziResultViewModel;

  constructor(private router: Router) {}

  ngOnInit() {}

  onDetailsClicked() {
    this.router.navigate(['/char', this.document.id])
  }
}
