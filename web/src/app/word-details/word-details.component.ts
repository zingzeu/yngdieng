import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {YngdiengDocument} from 'yngdieng/shared/documents_pb';

import {YngdiengBackendService} from '../yngdieng-backend.service';

@Component({
  selector: 'app-word-details',
  templateUrl: './word-details.component.html',
  styleUrls: ['./word-details.component.scss']
})
export class WordDetailsComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  text: string;

  constructor(
      private backendService: YngdiengBackendService,
      private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    let currentDocument$ = this.route.paramMap.pipe(
        map(paramMap => paramMap.get('id')),
        switchMap(docId => this.backendService.getYngdiengDocument(docId)));
    currentDocument$.subscribe(d => {this.text = d.toString()})
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
