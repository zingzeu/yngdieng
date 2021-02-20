import {Component, OnInit} from '@angular/core';
import {YngdiengBackendService} from '../yngdieng-backend.service';
import {Word} from 'yngdieng/yngdieng/frontend/v3/service_pb';
@Component({
  selector: 'app-wordlist-demo',
  templateUrl: './wordlist-demo.component.html',
  styleUrls: ['./wordlist-demo.component.scss'],
})
export class WordlistDemoComponent implements OnInit {
  words: Word[];
  constructor(private backendService: YngdiengBackendService) {}

  ngOnInit(): void {
    this.backendService.listWordListWords('wordLists/1', '').subscribe(
      response => {
        this.words = response.getWordsList();
      },
      err => {
        console.error(err);
      }
    );
  }
}
