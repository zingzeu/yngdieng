export const search = async (fromIndex = 0, amountToFetch = 10) => {
  const mockResultList = [
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
  return mockResultList;
};

export const fetchWordDetail = async wordId => {
  const mockWord = {
    _id: 'mock',
    word: '反',
    image: 'https://via.placeholder.com/150',
    pronounces: [
      {
        typeName: '连续',
        symbol: 'bung1',
      },
    ],
    explainations: [
      {
        text: '指将龙舟翻转的动作',
        source: '来源：诸神的游戏 [M]',
      },
    ],
    collections: [
      {
        id: '诸神的游戏',
        name: '《诸神的游戏》官方词表',
        description:
          '福州龙船文化词汇全搜罗，一起来做龙癫吧！本书京宝热销中https://tao...',
        likes: 102,
      },
    ],
    stories: [
      '……如做龙骨、钉底板，做船扼、装鱼梁、坐板等等。组装好之后，还要抛光、胶缝，油漆、画花，最后安上雕刻好的龙头。“整个过程中，装鱼梁是最难的。我们制作的龙舟，最长的有23米，所以鱼梁也有20多米，又长又弯，安装全凭老师傅多年积累的技艺和经验。”……',
    ],
    transcriptions: [
      {
        source: '福州话教会罗马字',
        value: 'lung-sung-dieng',
      },
      {
        source: '马祖闽东',
        value: 'lung-sung-dieng',
      },
    ],
    pronouncesFromDifferentSpeakers: [
      {
        name: 'lung-nung-dieng',
        likes: 102,
        speaker: {
          name: '无名氏',
          age: 10,
          gender: '男',
          area: '长乐某地',
        },
      },
      {
        name: '机器生成 - 单字音',
        likes: 12,
        speaker: {
          name: '刘剑',
          age: 12,
          gender: '女',
          area: '闽侯某地',
        },
      },
    ],
  };
  return mockWord;
};
