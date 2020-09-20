import {Tone} from '../../shared/phonology_pb';

import {getToneFromString} from './utils';

describe('yngdieng utils smoke tests', () => {
  it('getToneFromString should return correct value', () => {
    expect(getToneFromString('上去') == Tone.UP_FALLING).toBe(true);
  });
});
