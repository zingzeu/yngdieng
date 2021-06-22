import React, {useState, useEffect} from 'react';
import Taro, {
  useRouter,
  useShareAppMessage,
  useShareTimeline,
} from '@tarojs/taro';
import {View, Input, Block, ScrollView} from '@tarojs/components';
import {AtIcon} from 'taro-ui';
import routes from '@/routes';
import Header from '@/pages/header/header';
import WordCard from '@/components/wordCard/wordCard';
import {realSearch} from '@/store/actions/dictionary';
import styles from './search.module.scss';
import SurveyBanner from '@/components/survey-banner/survey-banner';

// Empty page token returned by the server indicates the end of pages.
const FINAL_PAGE_TOKEN = '';

interface RichText {
  segments: {text: string}[];
}
interface GenericMessage {
  message: RichText;
}
interface Word {
  id: string;
  yngping: RichText;
  hanzi: RichText;
  details: RichText;
}
interface ResultCard {
  no_results?: any;
  generic_message?: GenericMessage;
  end_of_results?: any;
  word?: Word;
}
const InitialState: {
  resultList: ResultCard[];
  nextPageToken?: string;
} = {
  resultList: [],
  nextPageToken: undefined,
};

const Search = () => {
  const router = useRouter();
  const [inputString, setInputString] = useState('');
  const [resultList, setResultList] = useState(InitialState.resultList);
  const [nextPageToken, setNextPageToken] = useState(
    InitialState.nextPageToken
  );

  const handleConfirm = (word = inputString) => {
    if (word.trim() == '') {
      return;
    }
    if (inputString !== word) {
      setInputString(word);
    }
    setNextPageToken(undefined);
    fetchOnePage(word);
  };
  const handleLoadMore = () => {
    if (nextPageToken === FINAL_PAGE_TOKEN || nextPageToken === undefined) {
      // do nothing.
      return;
    }
    fetchOnePage(inputString, nextPageToken);
  };

  const fetchOnePage = (word: string, nextPageToken?: string) => {
    Taro.showNavigationBarLoading();
    realSearch(word, nextPageToken)
      .then(result => {
        if (nextPageToken === undefined) {
          setResultList(result.result_cards);
        } else {
          setResultList(resultList.concat(result.result_cards));
        }
        setNextPageToken(result.next_page_token);
        Taro.hideNavigationBarLoading();
      })
      .catch(e => {
        console.error(e);
        Taro.hideNavigationBarLoading();
      });
  };

  useShareTimeline(() => ({
    title: inputString,
    query: `word=${inputString}`,
  }));
  useShareAppMessage(() => {
    return {
      title: inputString,
      path: `${routes.SEARCH}?word=${inputString}`,
    };
  });
  useEffect(() => {
    const wordFromParams = decodeURIComponent(router.params.word || '');
    if (wordFromParams) {
      handleConfirm(wordFromParams);
    } else {
      toggleAdvanced(true);
    }
  }, []);
  return (
    <View className={styles.search}>
      <Header
        injectedComponents={
          <Block>
            <View className={styles.inputInjected}>
              <Input
                value={inputString}
                confirmType="search"
                placeholder="查字、词、读音..."
                onInput={e => setInputString(e.detail.value)}
                onConfirm={() => handleConfirm()}
              />
            </View>
            <View onClick={() => handleConfirm()}>
              <AtIcon value="search"></AtIcon>
            </View>
          </Block>
        }
      />
      <View className={styles.content}>
        <View className={styles.result}>
          <SurveyBanner />
          <View
            className={`${styles.resultTitle} at-row at-row__justify--between at-row__align--center`}
          ></View>
          <View className={styles.resultList}>
            <ScrollView
              enableBackToTop
              enableFlex
              scrollWithAnimation
              scrollY
              className={styles.scrollView}
              onScrollToLower={handleLoadMore}
              lowerThreshold={100}
              upperThreshold={20}
            >
              {resultList?.map(resultItem => renderResultItem(resultItem))}
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
};

function renderResultItem(resultCard: ResultCard) {
  if (resultCard.no_results !== undefined) {
    return renderHintText('没有找到结果。换个关键词试试？');
  }
  if (resultCard.word !== undefined) {
    return renderWordCard(resultCard.word);
  }
  if (resultCard.generic_message !== undefined) {
    return renderHintText(flatten(resultCard.generic_message.message));
  }
  if (resultCard.end_of_results !== undefined) {
    return renderHintText('没有更多结果了');
  }
}

function renderHintText(message: string) {
  return (
    <View className={styles.hintText} key={'hintText-' + message}>
      {message}
    </View>
  );
}

function renderWordCard(word: Word) {
  return (
    <View className={styles.resultItem} key={word!.id}>
      <WordCard
        onClick={() =>
          Taro.navigateTo({
            url: `${routes.WORD_DETAIL}?id=${word.id}`,
          })
        }
        title={<View className={styles.title}>{flatten(word.hanzi)}</View>}
        description={flatten(word.details)}
        extraList={[{title: '榕拼', content: flatten(word.yngping)}]}
      />
    </View>
  );
}

export default Search;

export function flatten(richText: RichText): string {
  return richText.segments.map(s => s.text).join();
}
