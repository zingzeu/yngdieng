import {
  Component,
  Inject,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {FengDocument} from 'yngdieng/shared/documents_pb';

import {
  IYngdiengEnvironment,
  YNGDIENG_ENVIRONMENT,
} from '../../environments/environment';
import {renderExplanation} from '@yngdieng-shared-lib/explanations';

@Component({
  selector: 'app-feng-explanation',
  templateUrl: './feng-explanation.component.html',
  styleUrls: ['./feng-explanation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FengExplanationComponent implements OnInit {
  @Input('fengDoc') fengDoc: FengDocument;
  /** Display the canonical hanzi as part the title of the explanation section */
  @Input('showTitle') showTitle: boolean = true;
  toggleStructured: boolean = true;

  constructor(
    @Inject(YNGDIENG_ENVIRONMENT) private environment: IYngdiengEnvironment
  ) {}

  get showToggleStructured() {
    return (
      this.environment.structuredExplanations.enabled &&
      this.environment.structuredExplanations.showDebugToggle
    );
  }

  get showStructuredExplanation() {
    return (
      this.environment.structuredExplanations.enabled &&
      this.toggleStructured &&
      this.fengDoc != null &&
      this.fengDoc.getExplanationStructured() != null
    );
  }

  get structuredExplanation() {
    return renderExplanation(
      this.fengDoc.getExplanationStructured(),
      this.fengDoc.getHanziCanonical()
    );
  }

  ngOnInit(): void {}
}
