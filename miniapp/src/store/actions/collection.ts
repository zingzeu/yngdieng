import mockWordData from '../mock/mockWordData.json';
import {processWordList} from '../mock/utils';

export const getCollectionById = async collectionId => {
  const mockCollectionData = {
    id: '诸神的游戏',
    name: '《诸神的游戏》官方词表',
    description:
      '福州龙船文化词汇全搜罗，一起来做龙癫吧！本书京宝热销中https://tao...',
    publisher: {
      name: 'HOMELAND家园官方账号',
    },
    likes: 334,
    wordList: processWordList(mockWordData.slice(0, 10)),
  };
  return mockCollectionData;
};

export const getWordListByCollectionId = async (collectionId, fromIndex) => {
  const proccessedData = processWordList(
    mockWordData.slice(fromIndex, fromIndex + 10)
  );
  return proccessedData;
};
