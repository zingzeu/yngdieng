import {Pipe, PipeTransform} from '@angular/core';
import {RichText} from '../../../shared/services_pb';

@Pipe({
  name: 'rf',
})
export class RichtextFlattenPipe implements PipeTransform {
  transform(richText: RichText): string {
    return flatten(richText);
  }
}

export function flatten(richText: RichText): string {
  return richText
    .getSegmentsList()
    .map(s => s.getText())
    .join();
}
