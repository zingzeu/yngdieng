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
    wordList: [
      {
        id: '1',
        title: '我',
        description: '来源：诸神的游戏 [M]',
        pinyinRong: 'bung1',
        rimePosition: '邊春 上平',
      },
      {
        id: '2',
        title: '崩',
        description: '来源：诸神的游戏 [M]',
        pinyinRong: 'bung1',
        rimePosition: '邊春 上平',
      },
      {
        id: '3',
        title: '我',
        description: '来源：诸神的游戏 [M]',
        pinyinRong: 'bung1',
        rimePosition: '邊春 上平',
      },
      {
        id: '4',
        title: '崩',
        description: '来源：诸神的游戏 [M]',
        pinyinRong: 'bung1',
        rimePosition: '邊春 上平',
      },
      {
        id: '5',
        title: '我',
        description: '来源：诸神的游戏 [M]',
        pinyinRong: 'bung1',
        rimePosition: '邊春 上平',
      },
      {
        id: '6',
        title: '崩',
        description: '来源：诸神的游戏 [M]',
        pinyinRong: 'bung1',
        rimePosition: '邊春 上平',
      },
    ],
  };
  return mockCollectionData;
};

export const getWordListByCollectionId = async (collectionId, fromIndex) => {
  const wordList = [
    {
      id: '1',
      title: '我',
      description: '来源：诸神的游戏 [M]',
      pinyinRong: 'bung1',
      rimePosition: '邊春 上平',
    },
    {
      id: '2',
      title: '崩',
      description: '来源：诸神的游戏 [M]',
      pinyinRong: 'bung1',
      rimePosition: '邊春 上平',
    },
    {
      id: '3',
      title: '我',
      description: '来源：诸神的游戏 [M]',
      pinyinRong: 'bung1',
      rimePosition: '邊春 上平',
    },
    {
      id: '4',
      title: '崩',
      description: '来源：诸神的游戏 [M]',
      pinyinRong: 'bung1',
      rimePosition: '邊春 上平',
    },
    {
      id: '5',
      title: '我',
      description: '来源：诸神的游戏 [M]',
      pinyinRong: 'bung1',
      rimePosition: '邊春 上平',
    },
    {
      id: '6',
      title: '崩',
      description: '来源：诸神的游戏 [M]',
      pinyinRong: 'bung1',
      rimePosition: '邊春 上平',
    },
  ];
  return wordList;
};
