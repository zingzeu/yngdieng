import React, {useState} from 'react';
import Taro from '@tarojs/taro';
import {View, ScrollView, Input, Text} from '@tarojs/components';
import {AtIcon, AtAvatar} from 'taro-ui';
import Header from '@/pages/header/header';
import WordCard from '@/components/wordCard/wordCard';
import routes from '@/routes';
import styles from './collectionDetail.module.scss';

const mockWordList = [
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

const CollectionDetail = () => {
  const [wordList, setWordList] = useState(mockWordList);

  return (
    <View className={styles.collectionDetail}>
      <Header />
      <View className={styles.content}>
        <View className={styles.topBar}>
          <View className="at-row at-row__justify--between">
            <View className={styles.title}>《诸神的游戏》官方词表</View>
            <View className={styles.actionPanel}>
              <AtIcon value="file-generic"></AtIcon>
              <AtIcon value="bookmark"></AtIcon>
            </View>
          </View>
          <View className={styles.description}>
            福州龙船文化词汇全搜罗，一起来做龙癫吧！本书京宝热销中https://tao...
          </View>
          <View className="at-row at-row__justify--between">
            <View className={styles.publisher}>
              <View>HOMELAND家园官方账号</View>
            </View>
            <View>
              334 <AtIcon value="heart"></AtIcon>
            </View>
          </View>
        </View>
        <View className={styles.wordList}>
          <ScrollView
            enableBackToTop
            enableFlex
            className={styles.scrollView}
            scrollY
            lowerThreshold={20}
            upperThreshold={20}
          >
            {wordList.map(word => (
              <View className={styles.listItem} key={word.id}>
                <WordCard
                  onClick={() =>
                    Taro.navigateTo({
                      url: `${routes.WORD_DETAIL}?id=${word.id}`,
                    })
                  }
                  title={<View className={styles.title}>{word.title}</View>}
                  description={word.description}
                  extraList={[
                    {title: '榕拼', content: word.pinyinRong},
                    {title: '音韵地位', content: word.rimePosition},
                  ]}
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
