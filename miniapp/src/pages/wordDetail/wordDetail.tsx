import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import Taro, {useRouter, useShareAppMessage, useShareTimeline} from '@tarojs/taro';
import {View, RichText} from '@tarojs/components';
import {AtIcon, AtTabs, AtTabsPane, AtFloatLayout} from 'taro-ui';
import routes from '@/routes';
import Header from '@/pages/header/header';
import WordCard from '@/components/wordCard/wordCard';
import AudioPlay from '@/components/audioPlay/audioPlay';
import {fetchWord} from '@/store/actions/dictionary';
import PhonologyTab from './phonology-tab/phonology-tab';
import styles from './wordDetail.module.scss';
import {renderRichTextNode} from './rich-text';

interface Feng {
  explanation: string;
  hanzi_canonical: string;
  explanation_structured?: any;
  source: {
    page_number: number;
  };
}
interface Contrib {}
interface Source {
  feng?: Feng;
  contrib?: Contrib;
  generic?: {text: string; source: string};
}

const initialState: {
  wordDetail: {
    hanzi?: string;
    image?: string;
    pronounces?: {
      typeName: string;
      symbol: string;
      audioFileId?: string;
    }[];
    sources?: Source[];
    collections: {
      id: string;
      name: string;
      description: string;
    }[];
    audio_cards?: {
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
    hanzi: '',
    pronounces: [],
    sources: [],
    collections: [],
    stories: [],
    audio_cards: [],
    transcriptions: [],
    wordSplited: [],
  },
};

const WordDetail = () => {
  const router = useRouter();
  const [wordDetail, setWordDetail] = useState(initialState.wordDetail);
  const [currentTab, setCurrentTab] = useState(0);
  const [storyToShow, setStoryToShow] = useState('');

  useShareTimeline(() => ({
    title: wordDetail.hanzi,
  }))
  useShareAppMessage(() => ({
    title: wordDetail.hanzi,
  }));
  useEffect(() => {
    const wordName = toWordName(decodeURIComponent(router.params.id || ''));
    console.log(wordName);
    Taro.showNavigationBarLoading();
    fetchWord(wordName)
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
      <View className={styles.hero}>
        <View className="at-row at-row__justify--between">
          <View className={styles.word}>
            <View className={styles.label}>推荐用字</View>
            <selectable-text t={wordDetail.hanzi} />
          </View>
          <View className={styles.actionPanel}>
            <AtIcon value="help"></AtIcon>
            <AtIcon value="bookmark"></AtIcon>
          </View>
        </View>
        <View>
          {wordDetail.pronunciations?.map(p => (
            <View className={styles.rimeContainer}>
              <View className={styles.label}>{p.display_name}</View>
              <View>
                <selectable-text t={p.pronunciation} />
              </View>
              {p.audio && (
                <AudioPlay audioFileId={p.audio.remote_urls.remote_urls[0]} />
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
            {title: '发音'},
            {title: '词表'},
            {title: '故事'},
          ]}
          onClick={setCurrentTab}
        >
          <AtTabsPane current={currentTab} index={0}>
            <View className={clsx(styles.tabPane, styles.explanation)}>
              {!(wordDetail?.explanation?.length !== 0) && (
                <View>暂无解释</View>
              )}
              {
                <RichText
                  nodes={wordDetail.explanation
                    ?.map(e => renderRichTextNode(e))
                    .join('')}
                />
              }
            </View>
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={1}>
            <View className={styles.tabPane}>暂无例句</View>
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={2}>
            <View className={styles.tabPane}>
              <PhonologyTab audioCards={wordDetail.audio_cards} />
            </View>
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={3}>
            <View className={clsx(styles.tabPane, styles.collection)}>
              {wordDetail.word_lists?.map(wordList => (
                <WordCard
                  title={<View className={styles.title}>{wordList.title}</View>}
                  description={wordList.description}
                  actions={<AtIcon value="heart"></AtIcon>}
                  onClick={() =>
                    Taro.navigateTo({
                      url: `${routes.COLLECTION_DETAIL}?id=${wordList.name}`,
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

function toWordName(docIdOrWordName: string) {
  if (docIdOrWordName.startsWith('words/')) {
    return docIdOrWordName;
  }
  return `words/${docIdOrWordName}`;
}

export default WordDetail;
