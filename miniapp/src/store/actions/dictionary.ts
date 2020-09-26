import _get from 'lodash/get';
import mockWordData from '../mock/mockWordData.json';
import {processWordList} from '../mock/utils';
import Taro from '@tarojs/taro';

export const realSearch = async (
  query: string,
  pageToken: string = '',
  pageSize: number = 10
) => {
  let requestUrl = `https://api-rest.ydict.net/v2/search/${encodeURIComponent(
    query
  )}/${encodeURIComponent(pageToken)}?pageSize=${pageSize}`;
  console.log('search', requestUrl);
  const response = await Taro.request({
    url: requestUrl,
  });
  return response.data;
};

// Fake search
export const search = async (fromIndex = 0, amountToFetch = 10) => {
  console.log('fetch word list', fromIndex, amountToFetch);
  const proccessedData = processWordList(
    mockWordData.slice(fromIndex, fromIndex + amountToFetch)
  );
  return proccessedData;
};

export const fetchWordDetail = async wordId => {
  const wordDetail = mockWordData.find(word => word.simplifiedWord === wordId);
  return {
    ...wordDetail,
    word: wordDetail?.traditionalWord,
    stories: wordDetail?.stories || [],
    wordSplited: wordDetail?.wordSplited || [],
    collections: [
      {
        id: '诸神的游戏',
        name: '《诸神的游戏》官方词表',
        description:
          '福州龙船文化词汇全搜罗，一起来做龙癫吧！本书京宝热销中https://tao...',
        likes: 102,
      },
    ],
  };
};
