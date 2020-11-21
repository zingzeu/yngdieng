import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {YngdiengDocument} from '../../../../shared/documents_pb';

import {hanziToString} from '../common/hanzi-util';
import {
  WordDetailsHeroModel,
  WordPronunication,
} from '../word-details-hero/word-details-hero.component';
import {YngdiengTitleService} from '../yngdieng-title.service';

@Component({
  selector: 'app-word-details',
  templateUrl: './word-details.component.html',
  styleUrls: ['./word-details.component.scss'],
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
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isBusy = true;
    let currentDocument$ = this.route.data.pipe(map(data => data.word));
    this.subscription = currentDocument$.subscribe(
      d => {
        this.isBusy = false;
        this.hasError = false;
        this.document = d;
        let hanzi =
          d.getHanziCanonical() !== undefined
            ? hanziToString(d.getHanziCanonical())
            : '';
        this.titleService.setTitleForDetailsPage(hanzi);
        this.heroModel = new WordDetailsHeroModel(
          hanzi,
          new WordPronunication(d.getYngpingUnderlying(), d.getYngpingSandhi())
        );
      },
      _err => {
        this.isBusy = false;
        this.hasError = true;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
