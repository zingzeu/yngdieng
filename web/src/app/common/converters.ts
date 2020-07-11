import {HistoricalDocument} from 'yngdieng/shared/documents_pb';
import {getFinalString, getInitialString, getToneString} from 'yngdieng/web/src/yngdieng/utils';

import {getHanziString} from '../common/hanzi-util';

import {MonoHanziResultViewModel} from './view-models';

export function toMonoHanziResultViewModel(a: HistoricalDocument): MonoHanziResultViewModel {
  return {
    _type: 'single',
    id: a.getId(),
    hanziCanonical: getHanziString(a.getHanziCanonical()),
    hanziAlternatives: a.getHanziAlternativesList().map(getHanziString),
    yngping: a.getYngping(),
    initial: getInitialString(a.getInitial()),
    final: getFinalString(a.getFinal()),
    tone: getToneString(a.getTone()),
    ciklinSource: a.hasCiklinSource() ? '《戚林八音校注》' : null,
    dfdSource: a.hasDfdSource() ? 'Dictionary of Foochow Dialect' : null,
  } as MonoHanziResultViewModel;
}