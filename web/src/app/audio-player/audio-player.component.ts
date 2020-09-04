import {Component, Inject, Input, OnInit} from '@angular/core';

import {
  IYngdiengEnvironment,
  YNGDIENG_ENVIRONMENT,
} from '../../environments/environment';

import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnInit {
  public PlayerStateEnum = PlayerState;
  @Input('audioUrl') audioUrl: string;
  state: PlayerState = PlayerState.Idle;
  private currentAudio: HTMLAudioElement = null;

  constructor(
    @Inject(YNGDIENG_ENVIRONMENT) private environment: IYngdiengEnvironment,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  get shouldShow() {
    return (
      this.environment.showAudioPlayerButtons &&
      this.state !== PlayerState.Disabled
    );
  }

  onClicked() {
    switch (this.state) {
      case PlayerState.Idle:
        console.log('playing + ' + this.audioUrl);
        this.currentAudio = new Audio(this.audioUrl);
        this.state = PlayerState.Loading;
        this.currentAudio.onended = () => {
          this.state = PlayerState.Idle;
          this.currentAudio = null;
        };
        this.currentAudio.oncanplaythrough = () => {
          this.state = PlayerState.Playing;
          this.currentAudio.play();
        };
        this.currentAudio.onerror = e => {
          this.currentAudio = null;
          this.state = PlayerState.Disabled;
          this._snackBar.open('暂时没有对应的音频', '', {
            duration: 2000,
          });
        };
        break;
      case PlayerState.Playing:
        if (this.currentAudio != null) {
        }
        break;
      case PlayerState.Loading:
      case PlayerState.Disabled:
        console.log('Do nothing');
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
