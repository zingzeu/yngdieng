import Taro from '@tarojs/taro';

const HOMELAND_WORD_LISTS = {
  'lung-nung-dieng': 'wordLists/1',
  'lung-nung-dieng-2': 'wordLists/2',
};

export const getCollectionById = async collectionId => {
  var isHomeland = false;
  if (HOMELAND_WORD_LISTS[collectionId] !== undefined) {
    collectionId = HOMELAND_WORD_LISTS[collectionId];
    isHomeland = true;
  }
  console.log('Start', collectionId);
  const wordList = await Taro.request({
    url: `https://api-rest.ydict.net/v3/${collectionId}`,
  });
  const wordListWords = await Taro.request({
    url: `https://api-rest.ydict.net/v3/${collectionId}/words`,
  });
  return {
    ...wordList.data,
    publisherName: isHomeland ? 'HOMELAND家园官方账号' : '真鸟囝天团',
    wordList: wordListWords.data.words || [],
  };
};

export const getWordListByCollectionId = async (
  collectionId,
  nextPageToken
) => {
  return [];
};
