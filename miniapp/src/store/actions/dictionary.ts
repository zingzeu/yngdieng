import _get from 'lodash/get';
import Taro from '@tarojs/taro';

const API_PREFIX = 'https://api-rest.ydict.net/v2/';

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
