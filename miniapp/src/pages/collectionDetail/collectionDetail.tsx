import React, {useState, useEffect} from 'react';
import produce from 'immer';
import Taro, {useRouter, useShareAppMessage} from '@tarojs/taro';
import {View, ScrollView} from '@tarojs/components';
import {AtIcon} from 'taro-ui';
import Header from '@/pages/header/header';
import WordCard from '@/components/wordCard/wordCard';
import routes from '@/routes';
import {getWordList, getWordListWords} from '@/store/actions/collection';
import styles from './collectionDetail.module.scss';

const initialState: {
  collectionDetail: {
    title: string;
    description: string;
    upvotes: number;
    publisherName: string;
    words: {
      name: string;
      hanzi: string;
      snippet: string;
      firstPron: string;
      rimePosition: string;
    }[];
  };
  nextPageToken?: string;
} = {
  collectionDetail: {
    title: '',
    description: '',
    upvotes: 0,
    publisherName: '',
    words: [],
  },
  nextPageToken: undefined,
};

const CollectionDetail = () => {
  const router = useRouter();
  const [liked, toggleLiked] = useState(false);
  const [collectionDetail, setCollectionDetail] = useState(
    initialState.collectionDetail
  );
  const [nextPageToken, setNextPageToken] = useState(
    initialState.nextPageToken
  );

  const handleLoadMore = () => {
    const wordListName = decodeURIComponent(router.params.id || '');
    Taro.showNavigationBarLoading();
    getWordListWords(wordListName, nextPageToken)
      .then(result => {
        Taro.hideNavigationBarLoading();
        setCollectionDetail(
          produce(collectionDetail, draft => {
            draft.words.splice(
              collectionDetail.words.length,
              0,
              ...result.data.words
            );
          })
        );
        setNextPageToken(result.data.next_page_token);
      })
      .catch(() => {
        Taro.hideNavigationBarLoading();
      });
  };

  useShareAppMessage(() => ({
    title: collectionDetail.title,
  }));
  useEffect(() => {
    const wordListName = router.params.id;
    Taro.showNavigationBarLoading();
    getWordList(wordListName)
      .then(result => {
        setCollectionDetail(result);
        console.log(result);
        setNextPageToken(result.nextPageToken);
        Taro.hideNavigationBarLoading();
      })
      .catch(() => {
        Taro.hideNavigationBarLoading();
      });
  }, []);
  return (
    <View className={styles.collectionDetail}>
      <Header />
      <View className={styles.content}>
        <View className={styles.topBar}>
          <View className="at-row at-row__justify--between">
            <View className={styles.title}>{collectionDetail.title}</View>
            <View className={styles.actionPanel}>
              <AtIcon value="file-generic"></AtIcon>
              <AtIcon value="bookmark"></AtIcon>
            </View>
          </View>
          <View className={styles.description}>
            {collectionDetail.description}
          </View>
          <View className="at-row at-row__justify--between">
            <View className={styles.publisher}>
              <View>{collectionDetail.publisherName}</View>
            </View>
            <View onClick={() => toggleLiked(!liked)}>
              {collectionDetail.upvotes + (liked ? 1 : 0)}{' '}
              {liked ? (
                <AtIcon value="heart-2"></AtIcon>
              ) : (
                <AtIcon value="heart"></AtIcon>
              )}
            </View>
          </View>
        </View>
        <View className={styles.wordList}>
          <ScrollView
            enableBackToTop
            enableFlex
            scrollY
            scrollWithAnimation
            className={styles.scrollView}
            onScrollToLower={handleLoadMore}
            lowerThreshold={20}
            upperThreshold={20}
          >
            {collectionDetail.words.map(word => (
              <View className={styles.listItem} key={word.name}>
                <WordCard
                  onClick={() =>
                    Taro.navigateTo({
                      url: `${routes.WORD_DETAIL}?id=${word.name}`,
                    })
                  }
                  title={<View className={styles.title}>{word.hanzi}</View>}
                  description={word.snippet}
                  extraList={[{title: '榕拼', content: word.firstPron}]}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default CollectionDetail;
