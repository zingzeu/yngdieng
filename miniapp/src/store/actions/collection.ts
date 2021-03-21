import Taro from '@tarojs/taro';

const HOMELAND_WORD_LISTS = ['wordLists/1', 'wordLists/2'];

export const getWordList = async (wordListName, initialPageSize = 10) => {
  var isHomeland = HOMELAND_WORD_LISTS.includes(wordListName);
  const wordList = await Taro.request({
    url: `https://api-rest.ydict.net/v3/${wordListName}`,
  });
  const wordListWords = await getWordListWords(
    wordListName,
    '',
    initialPageSize
  );
  return {
    ...wordList.data,
    publisherName: isHomeland ? 'HOMELAND家园官方账号' : '真鸟囝天团',
    words:
      wordListWords.data.words?.map(w => ({
        ...w,
        firstPron:
          w.pronunciations?.length !== 0
            ? w.pronunciations[0].pronunciation
            : undefined,
      })) || [],
    nextPageToken: wordListWords.data.next_page_token,
  };
};

export const getWordListWords = async (
  wordListName,
  pageToken: string = '',
  pageSize: number = 10
) => {
  return await Taro.request({
    url: `https://api-rest.ydict.net/v3/${wordListName}/words`,
    data: {
      pageToken,
      pageSize,
    },
  });
};
