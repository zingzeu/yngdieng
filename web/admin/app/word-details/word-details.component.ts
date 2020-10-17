import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Word} from '../../../../yngdieng/admin/v1/resources_pb';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-word-details',
  templateUrl: './word-details.component.html',
  styleUrls: ['./word-details.component.scss'],
})
export class WordDetailsComponent implements OnInit {
  word: Word;
  hanziControl = new FormControl('');
  hanziAltControl = new FormControl('');
  mandarinWordsControl = new FormControl('');
  glossControl = new FormControl('');

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((data: {word: Word}) => {
      this.word = data.word;
      this.hanziControl.setValue(data.word.getHanzi());
      this.hanziAltControl.setValue(
        data.word.getHanziAlternativesList().join(', ')
      );
      this.mandarinWordsControl.setValue(
        data.word.getMandarinWordsList().join(', ')
      );
      this.glossControl.setValue(data.word.getGloss());
    });
  }
}
