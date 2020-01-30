import { Component, OnInit, Input } from '@angular/core';
import { MonoHanziResultViewModel } from '../common/view-models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-single-char-result',
  templateUrl: './single-char-result.component.html',
  styleUrls: ['./single-char-result.component.scss']
})
export class SingleCharResultComponent implements OnInit {

  @Input("document") document: MonoHanziResultViewModel;


  constructor(private router:Router) { }

  ngOnInit() {
  }

  onDetailsClicked() {
    this.router.navigate(["/char",this.document.id])
  }

}
