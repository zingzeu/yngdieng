import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AdvancedSearchQueryBuilderService {
  private selectedInitialSource = new Subject<string | null>();
  private selectedFinalSource = new Subject<string | null>();
  private selectedToneSource = new Subject<string | null>();

  selectedInitial$: Observable<string> = this.selectedInitialSource.asObservable();
  selectedFinal$: Observable<string> = this.selectedFinalSource.asObservable();
  selectedTone$: Observable<string> = this.selectedToneSource.asObservable();

  constructor() {}

  selectInitial(i: string) {
    this.selectedInitialSource.next(i);
  }

  clearInitial() {
    this.selectedInitialSource.next(null);
  }

  selectFinal(f: string) {
    this.selectedFinalSource.next(f);
  }

  clearFinal() {
    this.selectedFinalSource.next(null);
  }

  selectTone(t: string) {
    this.selectedToneSource.next(t);
  }

  clearTone() {
    this.selectedToneSource.next(null);
  }
}
