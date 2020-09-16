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
    private snackBar: MatSnackBar
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
        fetch(this.audioUrl)
          .then(response => {
            if (!response.ok) {
              if (response.status === 404) {
                this.state = PlayerState.Disabled;
                this.snackBar.open(
                  '不好意思，这条发音暂时没有对应的音频。',
                  '那好吧',
                  {
                    duration: 10000,
                  }
                );
                return null;
              }
              throw new Error('other error');
            }
            return response.blob();
          })
          .then(audioBlob => {
            if (audioBlob != null) {
              var blobUrl = window.URL.createObjectURL(audioBlob);
              this.currentAudio = new Audio(blobUrl);
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
                // expecting decoding error
                console.log(this.currentAudio.error.code);
                this.currentAudio = null;
                this.state = PlayerState.Disabled;
                this.snackBar.open(
                  '不好意思，音频文件无法播放。\n' +
                    '麻烦你把这个状况反馈给我们团队。' +
                    '你可以在「帮助」找到我们的联系方式。',
                  '好的',
                  {
                    duration: 20000,
                  }
                );
              };
            }
          })
          .catch(error => {
            // expecting network connection error or server error
            console.log(error);
            this.snackBar.open(
              '暂时无法下载音频文件。请确认你的网络连接是否正常。\n' +
                '如果重试多次依然不成功，可以联系我们来帮忙。\n' +
                '在「帮助」页面能找到我们的联系方式。',
              '好的',
              {
                duration: 20000,
              }
            );
            this.state = PlayerState.Idle;
          });
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
