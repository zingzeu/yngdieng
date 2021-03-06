import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {Word} from 'yngdieng/yngdieng/frontend/v3/service_pb';
import {wordNameToDocId} from '../common/resource-names';
import {
  WordDetailsHeroModel,
  WordPronunciation,
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
  document: Word;
  heroModel = new WordDetailsHeroModel('', '', []);
  text: string;
  largeScreen$: any;

  constructor(
    private titleService: YngdiengTitleService,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver
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
        let hanzi = this.document.getHanzi();
        this.titleService.setTitleForDetailsPage(hanzi);
        this.heroModel = new WordDetailsHeroModel(
          hanzi,
          wordNameToDocId(this.document.getName()),
          this.document
            .getPronunciationsList()
            .map(
              p =>
                new WordPronunciation(
                  p.getDisplayName(),
                  p.getPronunciation(),
                  p.getAudio().hasRemoteUrls()
                    ? p.getAudio().getRemoteUrls().getRemoteUrlsList()[0]
                    : null
                )
            )
        );
      }
    });
    this.largeScreen$ = this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .pipe(map(state => state.matches));
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
