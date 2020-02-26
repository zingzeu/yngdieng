import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {AdvancedSearchQueryBuilderService} from '../advanced-search-query-builder.service';

@Component({
  selector: 'app-search-toolbar',
  templateUrl: './search-toolbar.component.html',
  styleUrls: ['./search-toolbar.component.scss']
})
export class SearchToolbarComponent implements OnInit, OnDestroy {
  @Output() performSearch = new EventEmitter<string>();
  @Output() navigateBack = new EventEmitter<string>();

  searchForm;

  initial: string|null;
  final: string|null;
  tone: string|null;

  private initialSubscription: Subscription;
  private finalSubscription: Subscription;
  private toneSubscription: Subscription;

  constructor(
      private formBuilder: FormBuilder, private asqbService: AdvancedSearchQueryBuilderService) {
    this.searchForm = this.formBuilder.group({
      textQuery: '',
    });

    this.initialSubscription = asqbService.selectedInitial$.subscribe(i => this.initial = i);
    this.finalSubscription = asqbService.selectedFinal$.subscribe(f => this.final = f);
    this.toneSubscription = asqbService.selectedTone$.subscribe(t => this.tone = t)
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.initialSubscription.unsubscribe();
    this.finalSubscription.unsubscribe();
    this.toneSubscription.unsubscribe();
  }

  @Input()
  set queryFromUrl(queryFromUrl: string) {
    this.searchForm.controls.textQuery.setValue(queryFromUrl);
  }

  get showingPhonologyQuery(): boolean {
    return this.initial != null || this.final != null || this.tone != null;
  }

  onClearInitial() {
    this.asqbService.clearInitial();
  }

  onClearFinal() {
    this.asqbService.clearFinal();
  }

  onClearTone() {
    this.asqbService.clearTone();
  }

  onSubmit() {
    this.textSearch();
  }

  onBackClicked() {
    this.navigateBack.emit();
  }

  onSearch() {
    if (this.showingPhonologyQuery) {
      this.phonologySearch();
    } else {
      this.textSearch();
    }
  }

  private textSearch() {
    let textQuery = this.searchForm.controls.textQuery.value;
    this.performSearch.emit(textQuery);
  }

  private phonologySearch() {
    let queryString = (this.initial ? 'i:' + this.initial : '') +
        (this.final ? ' f:' + this.final : '') + (this.tone ? ' t:' + this.tone : '');
    this.performSearch.emit(queryString);
  }
}
