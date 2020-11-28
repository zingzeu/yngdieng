import {Component, OnInit, Input} from '@angular/core';
import {ContribDocument} from '../../../../shared/documents_pb';
import {renderExplanation} from '@yngdieng-shared-lib/explanations';

@Component({
  selector: 'app-contrib-explanation',
  templateUrl: './contrib-explanation.component.html',
  styleUrls: ['./contrib-explanation.component.scss'],
})
export class ContribExplanationComponent implements OnInit {
  @Input('doc') doc: ContribDocument;

  constructor() {}

  get showStructuredExplanation() {
    return this.doc != null && this.doc.getExplanationStructured() != null;
  }

  get structuredExplanation() {
    return renderExplanation(
      this.doc.getExplanationStructured(),
      this.doc.getHanzi()
    );
  }
  ngOnInit(): void {}
}
