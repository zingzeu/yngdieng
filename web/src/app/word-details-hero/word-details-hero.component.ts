import {Component, Inject, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {
  IYngdiengEnvironment,
  YNGDIENG_ENVIRONMENT,
} from '../../environments/environment';
import {YngpingHelpDialogComponent} from '../yngping-help-dialog/yngping-help-dialog.component';

/**
 * The hero component that's at the top of each word details page, containing summary information
 * like the hanzi and the pronunciation.
 */
@Component({
  selector: 'app-word-details-hero',
  templateUrl: './word-details-hero.component.html',
  styleUrls: ['./word-details-hero.component.scss'],
})
export class WordDetailsHeroComponent implements OnInit {
  @Input('model') model: WordDetailsHeroModel;

  constructor(
    @Inject(YNGDIENG_ENVIRONMENT) private environment: IYngdiengEnvironment,
    private dialog: MatDialog
  ) {}

  get shouldShowSandhi() {
    return (
      this.model.pron.sandhi !== '' &&
      this.model.pron.sandhi !== this.model.pron.underlying
    );
  }

  get audioUrlUnderlying() {
    return this.environment.serverUrl + '/tts/' + this.model.pron.underlying;
  }

  get audioUrlSandhi() {
    return this.environment.serverUrl + '/tts/' + this.model.pron.sandhi;
  }

  onShowYngpingHelp() {
    this.dialog.open(YngpingHelpDialogComponent, {width: '80vw'});
  }

  ngOnInit(): void {}
}

export class WordDetailsHeroModel {
  constructor(public hanzi: string, public pron: WordPronunication) {}
}

export class WordPronunication {
  constructor(public underlying: string, public sandhi: string) {}
}
