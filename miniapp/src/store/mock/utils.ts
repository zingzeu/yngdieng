import _get from 'lodash/get';

export const processWordList = wordList =>
  wordList.map(word => ({
    ...word,
    id: word.simplifiedWord || 'mockId',
    title: word.traditionalWord,
    description: _get(word, 'explainations.0.text', ''),
  }));
