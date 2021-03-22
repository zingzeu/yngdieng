import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {catchError, debounceTime, switchMap} from 'rxjs/operators';
import {YngdiengBackendService} from '../yngdieng-backend.service';

@Component({
  selector: 'app-simplification-tool',
  templateUrl: './simplification-tool.component.html',
  styleUrls: ['./simplification-tool.component.scss'],
})
export class SimplificationToolComponent implements OnInit {
  inputTextControl = new FormControl('');
  output: string = '';
  hasError = false;

  constructor(private backendService: YngdiengBackendService) {}

  ngOnInit(): void {
    this.inputTextControl.valueChanges
      .pipe(debounceTime(500))
      .pipe(switchMap(inputText => this.backendService.simplifyText(inputText)))
      .pipe(
        catchError((e, originalObservable) => {
          console.log(e);
          this.hasError = true;
          return originalObservable;
        })
      )
      .subscribe(response => {
        this.output = response;
        this.hasError = false;
      });
  }
}
