import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details-mono-hanzi',
  templateUrl: './details-mono-hanzi.component.html',
  styleUrls: ['./details-mono-hanzi.component.scss']
})
export class DetailsMonoHanziComponent implements OnInit {

  constructor(
    private location:Location,
    private route: ActivatedRoute,) { }

  ngOnInit() {
    var docId = this.route.snapshot.paramMap.get("id");
    
  }

  onBackClicked() {
    this.location.back();
  }

}
