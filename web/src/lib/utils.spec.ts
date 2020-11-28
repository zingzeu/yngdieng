import {Tone} from 'yngdieng/shared/phonology_pb';

import {getToneFromString} from '@yngdieng-shared-lib/utils';

describe('yngdieng utils smoke tests', () => {
  it('getToneFromString should return correct value', () => {
    expect(getToneFromString('上去') == Tone.UP_FALLING).toBe(true);
  });
});
