import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import Taro, {useRouter} from '@tarojs/taro';
import {View, Block, Image} from '@tarojs/components';
import {AtIcon, AtTabs, AtTabsPane, AtFloatLayout} from 'taro-ui';
import routes from '@/routes';
import Header from '@/pages/header/header';
import WordCard from '@/components/wordCard/wordCard';
import AudioPlay from '@/components/audioPlay/audioPlay';
import {fetchWordDetail} from '@/store/actions/dictionary';
import Phonology from './phonology/phonology';
import styles from './wordDetail.module.scss';

const initialState: {
  wordDetail: {
    word?: string;
    image?: string;
    pronounces?: {
      typeName: string;
      symbol: string;
      audioFileId?: string;
    }[];
    explainations?: {
      text?: string;
      source?: string;
    }[];
    collections: {
      id: string;
      name: string;
      description: string;
    }[];
    pronouncesFromDifferentSpeakers?: {
      name: string;
      likes: number;
      speaker: {
        name: string;
        age?: number;
        gender: string;
        area: string;
      };
    }[];
    transcriptions?: {
      value?: string;
      name: string;
    }[];
    wordSplited: {
      word: string;
      pinyin: string;
    }[];
    stories?: string[];
  };
} = {
  wordDetail: {
    word: '',
    image: '',
    pronounces: [],
    explainations: [],
    collections: [],
    stories: [],
    pronouncesFromDifferentSpeakers: [],
    transcriptions: [],
    wordSplited: [],
  },
};

const WordDetail = () => {
  const router = useRouter();
  const [wordDetail, setWordDetail] = useState(initialState.wordDetail);
  const [currentTab, setCurrentTab] = useState(0);
  const [storyToShow, setStoryToShow] = useState('');

  useEffect(() => {
    const wordId = router.params.id;
    Taro.showNavigationBarLoading();
    fetchWordDetail(wordId)
      .then(result => {
        setWordDetail(result);
        Taro.hideNavigationBarLoading();
      })
      .catch(() => {
        Taro.hideNavigationBarLoading();
      });
  }, []);
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
          {wordDetail.pronounces?.map(pronounce => (
            <View className={styles.rimeContainer}>
              <View className={styles.rimePosition}>{pronounce.typeName}</View>
              <View>{pronounce.symbol}</View>
              {pronounce.audioFileId && (
                <AudioPlay audioFileId={pronounce.audioFileId} />
              )}
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
              {wordDetail.explainations?.map((explaination, index) => (
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
                    Taro.navigateTo({
                      url: `${routes.COLLECTION_DETAIL}?id=${collection.id}`,
                    })
                  }
                />
              ))}
            </View>
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={4}>
            <View className={styles.tabPane}>
              {wordDetail.stories?.map(story => (
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
