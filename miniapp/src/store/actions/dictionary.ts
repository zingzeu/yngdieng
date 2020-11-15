import _get from 'lodash/get';
import mockWordData from '../mock/mockWordData.json';
import Taro from '@tarojs/taro';
import wordCard from '@/components/wordCard/wordCard';

const API_PREFIX = 'https://api-rest.ydict.net/v2/';
const MOCK_COLLECTION = {
  id: '诸神的游戏',
  name: '《诸神的游戏》官方词表',
  description:
    '福州龙船文化词汇全搜罗，一起来做龙癫吧！本书京宝热销中https://tao...',
  likes: 102,
};
export const realSearch = async (
  query: string,
  pageToken: string = '',
  pageSize: number = 10
) => {
  const response = await Taro.request({
    url: `${API_PREFIX}search`,
    data: {
      query,
      pageToken,
      pageSize,
    },
  });
  return response.data;
};

export const fetchWord = async wordName => {
  if (!wordName.startsWith('words/')) {
    throw new Error(`${wordName} is not a valid Word resource name`);
  }
  const word = (
    await Taro.request({
      url: 'https://api-rest.ydict.net/v3/' + wordName,
    })
  ).data;
  console.log(word);
  return word;
};
