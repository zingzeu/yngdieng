import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {YngdiengDocument} from 'yngdieng/shared/documents_pb';

import {hanziToString} from '../common/hanzi-util';
import {WordDetailsHeroModel, WordPronunication} from '../word-details-hero/word-details-hero.component';
import {YngdiengBackendService} from '../yngdieng-backend.service';
import {YngdiengTitleService} from '../yngdieng-title.service';

@Component({
  selector: 'app-word-details',
  templateUrl: './word-details.component.html',
  styleUrls: ['./word-details.component.scss']
})
export class WordDetailsComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  isBusy: boolean = false;
  hasError: boolean = false;
  document: YngdiengDocument;
  heroModel = new WordDetailsHeroModel('', new WordPronunication('', ''));
  text: string;

  constructor(
      private titleService: YngdiengTitleService,
      private backendService: YngdiengBackendService,
      private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.isBusy = true;
    let currentDocument$ = this.route.paramMap.pipe(
        map(paramMap => paramMap.get('id')),
        switchMap(docId => this.backendService.getYngdiengDocument(docId)));
    this.subscription = currentDocument$.subscribe(
        d => {
          this.isBusy = false;
          this.hasError = false;
          console.log(d);
          this.document = d;
          let hanzi =
              d.getHanziCanonical() !== undefined ? hanziToString(d.getHanziCanonical()) : '';
          this.titleService.setTitleForDetailsPage(hanzi);
          this.heroModel = new WordDetailsHeroModel(
              hanzi, new WordPronunication(d.getYngpingUnderlying(), d.getYngpingSandhi()));
        },
        _err => {
          this.isBusy = false;
          this.hasError = true;
        });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
