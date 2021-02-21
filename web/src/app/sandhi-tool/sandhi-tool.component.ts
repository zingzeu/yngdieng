import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {catchError, debounceTime, map, switchMap} from 'rxjs/operators';
import {YngdiengBackendService} from '../yngdieng-backend.service';

@Component({
  selector: 'app-sandhi-tool',
  templateUrl: './sandhi-tool.component.html',
  styleUrls: ['./sandhi-tool.component.scss'],
})
export class SandhiToolComponent implements OnInit {
  inputTextControl = new FormControl('');
  output: any[];
  hasError = false;

  constructor(private backendService: YngdiengBackendService) {}

  ngOnInit(): void {
    this.inputTextControl.valueChanges
      .pipe(debounceTime(500))
      .pipe(
        switchMap(inputText =>
          this.backendService.generateSandhi(inputText.split('\n'))
        )
      )
      .pipe(
        catchError((e, originalObservable) => {
          console.log(e);
          this.hasError = true;
          return originalObservable;
        })
      )
      .subscribe(response => {
        this.output = response.getResultsList();
        this.hasError = false;
      });
  }
}
