import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import Taro, {useRouter, render} from '@tarojs/taro';
import {View, Block, Image, RichText} from '@tarojs/components';
import {AtIcon, AtTabs, AtTabsPane, AtFloatLayout} from 'taro-ui';
import routes from '@/routes';
import Header from '@/pages/header/header';
import WordCard from '@/components/wordCard/wordCard';
import AudioPlay from '@/components/audioPlay/audioPlay';
import {fetchWordDetail} from '@/store/actions/dictionary';
import Phonology from './phonology/phonology';
import styles from './wordDetail.module.scss';
import {renderExplanation} from './explanations';
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
    word?: string;
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
    sources: [],
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
    const wordId = decodeURIComponent(router.params.id || '');
    Taro.showNavigationBarLoading();
    fetchWordDetail(wordId)
      .then(result => {
        console.log(result);
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
              {!(wordDetail.sources?.length !== 0) && <View>暂无解释</View>}
              {wordDetail.sources?.map(
                source =>
                  (source.generic && renderGeneric(source.generic)) ||
                  (source.feng && renderFeng(source.feng)) ||
                  (source.contrib && renderContrib(source.contrib))
              )}
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

function renderGeneric(generic) {
  return (
    <Block>
      <View>
        <View>
          <View>{generic.text}</View>
        </View>
      </View>
      <View className={styles.source}>来源：{generic.source}</View>
    </Block>
  );
}

function renderFeng(feng: Feng) {
  return (
    <Block>
      <View>
        <View>
          <View>
            {feng.explanation_structured && (
              <RichText
                nodes={renderExplanation(
                  feng.explanation_structured,
                  feng.hanzi_canonical
                )}
              ></RichText>
            )}
          </View>
        </View>
      </View>
      <View className={styles.source}>
        出处：冯爱珍. 1998. 福州方言词典. 南京: 江苏教育出版社. 第{' '}
        {feng.source.page_number} 页. 用字可能经过编辑修订.
      </View>
    </Block>
  );
}

function renderContrib(doc: Contrib) {
  return (
    <Block>
      <View>
        <View>
          <View>
            {doc.explanation_structured && (
              <RichText
                nodes={renderExplanation(doc.explanation_structured, doc.hanzi)}
              ></RichText>
            )}
          </View>
        </View>
      </View>
      <View className={styles.source}>
        此条目来自网友贡献。贡献者：
        {doc.contributors.join(',')} 。
      </View>
    </Block>
  );
}

export default WordDetail;
