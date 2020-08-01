import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {YngdiengDocument} from 'yngdieng/shared/documents_pb';

import {hanziToString} from '../common/hanzi-util';
import {WordDetailsHeroModel, WordPronunication} from '../word-details-hero/word-details-hero.component';
import {YngdiengBackendService} from '../yngdieng-backend.service';

@Component({
  selector: 'app-word-details',
  templateUrl: './word-details.component.html',
  styleUrls: ['./word-details.component.scss']
})
export class WordDetailsComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  heroModel = new WordDetailsHeroModel('', new WordPronunication('', ''));
  text: string;

  constructor(
      private backendService: YngdiengBackendService,
      private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    let currentDocument$ = this.route.paramMap.pipe(
        map(paramMap => paramMap.get('id')),
        switchMap(docId => this.backendService.getYngdiengDocument(docId)));
    this.subscription = currentDocument$.subscribe(d => {
      console.log(d);
      this.heroModel = new WordDetailsHeroModel(
          /* hanzi= */ d.getHanziCanonical() !== undefined ? hanziToString(d.getHanziCanonical()) :
                                                             '',
          new WordPronunication(d.getYngpingUnderlying(), d.getYngpingSandhi()));
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
