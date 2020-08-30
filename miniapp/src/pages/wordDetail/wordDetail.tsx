import React, {useState} from 'react';
import clsx from 'clsx';
import Taro from '@tarojs/taro';
import {View, Block, Image} from '@tarojs/components';
import {AtIcon, AtTabs, AtTabsPane, AtFloatLayout} from 'taro-ui';
import routes from '@/routes';
import Header from '@/pages/header/header';
import WordCard from '@/components/wordCard/wordCard';
import Phonology from './phonology/phonology';
import styles from './wordDetail.module.scss';

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

const WordDetail = () => {
  const [wordDetail, setWordDetail] = useState(mockWord);
  const [currentTab, setCurrentTab] = useState(0);
  const [storyToShow, setStoryToShow] = useState('');

  return (
    <View>
      <Header />
      <View className={styles.topBar}>
        <View className="at-row at-row__justify--between">
          <View className={styles.word}>{wordDetail.word}</View>
          <View className={styles.actionPanel}>
            <AtIcon value="help"></AtIcon>
            <AtIcon value="bookmark"></AtIcon>
          </View>
        </View>
        <View>
          {wordDetail.pronounces.map(pronounce => (
            <View className={styles.rimeContainer}>
              <View className={styles.rimePosition}>{pronounce.typeName}</View>
              <View>{pronounce.symbol}</View>
              <View>
                <AtIcon value="volume-plus"></AtIcon>
              </View>
            </View>
          ))}
        </View>
      </View>
      <View>
        <AtTabs
          current={currentTab}
          scroll
          tabList={[
            {title: '释义'},
            {title: '更多例句'},
            {title: '音韵'},
            {title: '词表'},
            {title: '故事'},
          ]}
          onClick={setCurrentTab}
        >
          <AtTabsPane current={currentTab} index={0}>
            <View className={clsx(styles.tabPane, styles.explanation)}>
              {wordDetail.explainations.map((explaination, index) => (
                <Block>
                  <View>
                    <View>
                      <View>{`${index + 1}. ${explaination.text}`}</View>
                    </View>
                  </View>
                  <View className={styles.source}>
                    来源：{explaination.source}
                  </View>
                </Block>
              ))}
              {wordDetail.image && <Image src={wordDetail.image} />}
            </View>
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={1}>
            <View className={styles.tabPane}>暂无例句</View>
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={2}>
            <View className={styles.tabPane}>
              <Phonology wordDetail={wordDetail} />
            </View>
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={3}>
            <View className={clsx(styles.tabPane, styles.collection)}>
              {wordDetail.collections.map(collection => (
                <WordCard
                  title={
                    <View className={styles.title}>{collection.name}</View>
                  }
                  description={collection.description}
                  actions={<AtIcon value="heart"></AtIcon>}
                  onClick={() =>
                    Taro.redirectTo({
                      url: `${routes.COLLECTION_DETAIL}?id=${collection.id}`,
                    })
                  }
                />
              ))}
            </View>
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={4}>
            <View className={styles.tabPane}>
              {wordDetail.stories.map(story => (
                <WordCard
                  onClick={() => setStoryToShow(story)}
                  description={story}
                />
              ))}
            </View>
          </AtTabsPane>
        </AtTabs>
      </View>
      <AtFloatLayout
        isOpened={!!storyToShow}
        title="故事全文"
        onClose={() => setStoryToShow('')}
      >
        {storyToShow}
      </AtFloatLayout>
    </View>
  );
};

export default WordDetail;
