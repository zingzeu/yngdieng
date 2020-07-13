import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit {
  public PlayerStateEnum = PlayerState

      @Input('audioUrl') audioUrl: string;

  state: PlayerState = PlayerState.Idle

                       private currentAudio: HTMLAudioElement = null;

  constructor() {}

  ngOnInit(): void {}

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
        this.currentAudio.onerror = (e) => {
          let mediaError = this.currentAudio.error;
          this.currentAudio = null;
          if (mediaError.message.indexOf('404') >= 0) {
            console.log('404 encountered. Disabling audio player for ' + this.audioUrl);
            this.state = PlayerState.Disabled;
          } else {
            this.state = PlayerState.Idle;
          }
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
  Disabled
}