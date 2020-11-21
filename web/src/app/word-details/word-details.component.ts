import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
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
  hasError: boolean = false;
  document: YngdiengDocument;
  heroModel = new WordDetailsHeroModel('', new WordPronunication('', ''));
  text: string;

  constructor(
    private titleService: YngdiengTitleService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let resolveResult$ = this.route.data.pipe(
      map(data => data.wordResolveResult)
    );
    this.subscription = resolveResult$.subscribe(d => {
      if (d.error) {
        this.hasError = true;
      } else {
        this.hasError = false;
        this.document = d.word;
        let hanzi =
          this.document.getHanziCanonical() !== undefined
            ? hanziToString(this.document.getHanziCanonical())
            : '';
        this.titleService.setTitleForDetailsPage(hanzi);
        this.heroModel = new WordDetailsHeroModel(
          hanzi,
          new WordPronunication(
            this.document.getYngpingUnderlying(),
            this.document.getYngpingSandhi()
          )
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
