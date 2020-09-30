import {Component, Inject, Input, OnInit, OnDestroy} from '@angular/core';
import {Howl} from 'howler';
import {
  IYngdiengEnvironment,
  YNGDIENG_ENVIRONMENT,
} from '../../environments/environment';

import {MatSnackBar} from '@angular/material/snack-bar';

const SNACKBAR_DURATION_MS = 4000;

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  public PlayerStateEnum = PlayerState;

  @Input('audioUrl') audioUrl: string;
  @Input('preload') preload: boolean = false;

  state: PlayerState = PlayerState.Idle;
  private currentAudio: Howl = null;

  private hasClicked = false;

  constructor(
    @Inject(YNGDIENG_ENVIRONMENT) private environment: IYngdiengEnvironment,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.state = this.preload ? PlayerState.Loading : PlayerState.Idle;
    console.log('loading', this.audioUrl);
    this.currentAudio = new Howl({
      src: [`${this.audioUrl}.wav`, `${this.audioUrl}.mp3`],
      // Use HTML5 <audio> to bypass silent mode on iOS.
      // Howler defaults to Web Audio, which will be muted in silent mode.
      html5: true,
      preload: this.preload,
      onload: () => {
        this.state = PlayerState.Idle;
      },
      onplay: () => {
        this.state = PlayerState.Playing;
      },
      onend: () => {
        this.state = PlayerState.Idle;
      },
      onloaderror: (_, errorCode) => {
        console.log('audio load error', errorCode);
        if (typeof errorCode === 'string' && errorCode.indexOf('404') !== -1) {
          this.state = PlayerState.Disabled;
          this.hasClicked &&
            this.snackBar.open(`暂时没有这个读音对应的音频。`, 'OK', {
              duration: SNACKBAR_DURATION_MS,
            });
        } else {
          // transient network error
          this.state = PlayerState.Idle;
          this.hasClicked &&
            this.snackBar.open(`暂时无法播放音频。请稍后重试。`, 'OK', {
              duration: SNACKBAR_DURATION_MS,
            });
        }
      },
      onplayerror: (_, errorCode) => {
        // expecting decoding error
        console.error('Audio playback error', errorCode);
        this.currentAudio = null;
        this.state = PlayerState.Disabled;
        this.hasClicked &&
          this.snackBar.open(
            `音频文件无法播放。（错误代码：${errorCode}）`,
            'OK',
            {
              duration: SNACKBAR_DURATION_MS,
            }
          );
      },
    });
  }

  ngOnDestroy(): void {
    this.currentAudio?.unload();
  }

  get shouldShow() {
    return (
      this.environment.showAudioPlayerButtons &&
      this.state !== PlayerState.Disabled
    );
  }

  onClicked() {
    this.hasClicked = true;
    switch (this.state) {
      case PlayerState.Idle:
        if (this.currentAudio.state() !== 'loaded') {
          this.state = PlayerState.Loading;
          this.currentAudio.once('load', () => this.currentAudio.play());
          this.currentAudio.load();
        } else {
          this.currentAudio.play();
        }
        break;
      case PlayerState.Playing:
        this.currentAudio?.stop();
        break;
      case PlayerState.Loading:
      case PlayerState.Disabled:
        // do nothing
        break;
    }
  }
}

enum PlayerState {
  // Initial State.
  Idle,
  Loading,
  Playing,
  // When a 404 is encountered. Prevents further attempts.
  Disabled,
}
