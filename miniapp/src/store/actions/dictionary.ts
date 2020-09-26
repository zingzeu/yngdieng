import _get from 'lodash/get';
import mockWordData from '../mock/mockWordData.json';
import {processWordList} from '../mock/utils';
import Taro from '@tarojs/taro';

export const realSearch = async (
  query: string,
  pageToken: string = '',
  pageSize: number = 10
) => {
  let requestUrl =
    'https://api-rest.ydict.net/v2/search/' +
    encodeURIComponent(query) +
    '/' +
    encodeURIComponent(pageToken) +
    `?pageSize=${pageSize}`;
  console.log('search', requestUrl);
  const response = await Taro.request({
    url: requestUrl,
  });
  return response.data;
};

export const fetchWordDetail = async wordId => {
  return (
    (await fetchMockWordDetail(wordId)) || (await fetchYngdiengDocument(wordId))
  );
};

const fetchYngdiengDocument = async docId => {
  const yDoc = (
    await Taro.request({
      url:
        'https://api-rest.ydict.net/v2/yngdieng_document/' +
        encodeURIComponent(docId),
    })
  ).data;
  const shouldShowSandhi =
    yDoc.yngping_sandhi !== '' &&
    yDoc.yngping_underlying !== '' &&
    yDoc.yngping_sandhi !== yDoc.yngping_underlying;
  return {
    word: hanziToString(yDoc.hanzi_canonical),
    pronounces: shouldShowSandhi
      ? [
          {
            typeName: '市区单字',
            symbol: yDoc.yngping_underlying,
            audioFileId: getTtsAudioUrl(yDoc.yngping_underlying),
          },
          {
            typeName: '市区连读',
            symbol: yDoc.yngping_sandhi,
            audioFileId: getTtsAudioUrl(yDoc.yngping_sandhi),
          },
        ]
      : [
          {
            typeName: '福州市区',
            symbol: yDoc.yngping_sandhi,
            audioFileId: getTtsAudioUrl(yDoc.yngping_sandhi),
          },
        ],
    transcriptions: shouldShowSandhi
      ? [
          {name: '市区连读', value: yDoc.yngping_underlying},
          {name: '市区单字', value: yDoc.yngping_sandhi},
        ]
      : [{name: '福州市区', value: yDoc.yngping_sandhi}],
    pronouncesFromDifferentSpeakers: [],
    collections: [],
    wordSplited: [],
  };
};

const getTtsAudioUrl = yngping =>
  'https://api.ydict.net/tts/' + encodeURIComponent(yngping);

const fetchMockWordDetail = async wordId => {
  const wordDetail = mockWordData.find(word => word.simplifiedWord === wordId);
  if (wordDetail === undefined) return undefined;
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

function hanziToString(x) {
  return x.regular || '';
}
