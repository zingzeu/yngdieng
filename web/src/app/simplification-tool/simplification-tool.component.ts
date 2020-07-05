import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {catchError, debounceTime, map, switchMap} from 'rxjs/operators';

// const OPENCC_API = "http://opencc.api.yngdieng.org/hokchew"
const OPENCC_API = 'http://localhost:8081/hokchew'

    @Component({
      selector: 'app-simplification-tool',
      templateUrl: './simplification-tool.component.html',
      styleUrls: ['./simplification-tool.component.scss']
    }) export class SimplificationToolComponent implements OnInit {
  inputTextControl = new FormControl('');
  output: string = '';
  hasError = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.inputTextControl.valueChanges.pipe(debounceTime(500))
        .pipe(switchMap(inputText => this.http.post(OPENCC_API, inputText, {responseType: 'text'})))
        .pipe(catchError((e, originalObservable) => {
          console.log(e);
          this.hasError = true;
          return originalObservable;
        }))
        .subscribe(response => {
          this.output = response;
          this.hasError = false;
        })
  }
}
