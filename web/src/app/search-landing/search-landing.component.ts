import { Component, OnInit, ViewChild } from '@angular/core';
import { PhonologyComposerComponent } from '../phonology-composer/phonology-composer.component';
import { PhonologyQueryRendererComponent } from '../phonology-query-renderer/phonology-query-renderer.component';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-landing',
  templateUrl: './search-landing.component.html',
  styleUrls: ['./search-landing.component.scss']
})
export class SearchLandingComponent implements OnInit {

  searchForm;

  initial: string | null;
  final: string | null;
  tone: string | null;

  @ViewChild(PhonologyComposerComponent, {static: false})
  phonologyComposer: PhonologyComposerComponent;

  constructor(private formBuilder: FormBuilder,
    private router:Router) {
    this.searchForm = this.formBuilder.group({
      textQuery: '',
    });
   }

  ngOnInit() {
  }

  onInitialSelected(event: string) {
    this.initial = event;
  }

  onFinalSelected(event: string) {
    this.final = event;
  }

  onToneSelected(event: string) {
    this.tone = event;
  }

  onClearInitial() {
    this.initial = null;
  }

  onClearFinal() {
    this.final = null;
  }

  onClearTone() {
    this.initial = null;
  }

  onSubmit() {
    console.log("submit");
    this.textSearch();
  }

  onSearch() {
    if (this.initial || this.final || this.tone) {
      let queryString = 
      (this.initial ? "i:"+this.initial:"")+ 
      (this.final ? " f:"+this.final:"")+ 
      (this.tone ? " t:"+this.tone:"");
      this.router.navigate(["/search", queryString.trim()]);
    } else {
      this.textSearch();
    }
  }

  private textSearch() {
    let textQuery = this.searchForm.controls.textQuery.value;
    console.log(textQuery);
    this.router.navigate(["/search",textQuery])
  }

  onBackClicked() {
    this.router.navigate([""])
  }
}
