import {Component, OnInit, Input} from '@angular/core';
import {HistoricalDocument} from 'yngdieng/shared/documents_pb';
import {hanziToString} from '../common/hanzi-util';
import {getInitialString, getToneString, getFinalString} from '../../lib/utils';

@Component({
  selector: 'app-historical-details',
  templateUrl: './historical-details.component.html',
  styleUrls: ['./historical-details.component.scss'],
})
export class HistoricalDetailsComponent implements OnInit {
  @Input('doc') doc: HistoricalDocument;

  constructor() {}

  get hanzi() {
    return hanziToString(this.doc.getHanziCanonical());
  }

  get rimePosition() {
    return (
      getInitialString(this.doc.getInitial()) +
      getFinalString(this.doc.getFinal()) +
      ' ' +
      getToneString(this.doc.getTone())
    );
  }

  get sources() {
    var tmp = [];
    if (this.doc.hasCiklinSource()) {
      tmp.push('戚林八音校注');
    }
    if (this.doc.hasDfdSource()) {
      tmp.push('榕腔注音辞典·目录');
    }
    return tmp.join(', ');
  }

  ngOnInit(): void {}
}
