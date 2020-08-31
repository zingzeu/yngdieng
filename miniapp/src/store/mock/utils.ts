import _get from 'lodash/get';

export const processWordList = wordList =>
  wordList.map(word => ({
    ...word,
    id: word.simplifiedWord || 'mockId',
    title: word.traditionalWord,
    description: '来源：诸神的游戏 [M]',
    rimePosition: _get(
      word,
      'pronouncesFromDifferentSpeakers.0.speaker.area',
      ''
    ),
  }));
