import {Pipe, PipeTransform} from '@angular/core';
import {RichText} from 'yngdieng/shared/services_pb';

@Pipe({
  name: 'rf',
})
export class RichtextFlattenPipe implements PipeTransform {
  transform(richText: RichText): string {
    return richText
      .getSegmentsList()
      .map(s => s.getText())
      .join();
  }
}
