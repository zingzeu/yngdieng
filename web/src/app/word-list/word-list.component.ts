import {Component, OnInit} from '@angular/core';
import {
  FrontendService,
  Word,
} from '../../../../yngdieng/frontend/v3/service_pb';
import {WordList} from '../yngdieng/frontend/v3/resources_pb';

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.scss'],
})
export class WordListComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
