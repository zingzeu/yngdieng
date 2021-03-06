import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Component, Inject, Input, OnInit} from '@angular/core';
import {Clipboard} from '@angular/cdk/clipboard';
import {MatDialog} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {
  IYngdiengEnvironment,
  YNGDIENG_ENVIRONMENT,
} from '../../environments/environment';
import {YngpingHelpDialogComponent} from '../yngping-help-dialog/yngping-help-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';

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
  largeScreen$: Observable<boolean>;

  constructor(
    @Inject(YNGDIENG_ENVIRONMENT) private environment: IYngdiengEnvironment,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar
  ) {}

  onShowYngpingHelp() {
    this.dialog.open(YngpingHelpDialogComponent, {width: '80vw'});
  }

  onCopyMiniAppPath() {
    if (this.model.docId == '') {
      this.snackBar.open('此条目没有小程序链接');
      return;
    }
    let textToCopy = `${this.model.hanzi}: pages/wordDetail/wordDetail?id=${this.model.docId}`;
    this.clipboard.copy(textToCopy);
    this.snackBar.open('已复制: ' + textToCopy);
  }

  ngOnInit(): void {
    this.largeScreen$ = this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .pipe(map(state => state.matches));
  }
}

export class WordDetailsHeroModel {
  constructor(
    public hanzi: string,
    public docId: string,
    public prons: WordPronunication[]
  ) {}
}

export class WordPronunication {
  constructor(
    public displayName: string,
    public pronunciation: string,
    public audioUrl?: string
  ) {}
}
