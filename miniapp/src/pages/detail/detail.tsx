import React, {useState} from 'react';
import clsx from 'clsx';
import {View} from '@tarojs/components';
import {AtIcon, AtTabs, AtTabsPane} from 'taro-ui';
import Header from '@/pages/header/header';
import WordCard from '@/components/wordCard/wordCard';
import styles from './detail.module.scss';

const Detail = () => {
  const [currentTab, setCurrentTab] = useState(3);

  return (
    <View>
      <Header />
      <View className={styles.topBar}>
        <View className="at-row at-row__justify--between">
          <View className={styles.word}>反</View>
          <View className={styles.actionPanel}>
            <AtIcon value="help"></AtIcon>
            <AtIcon value="bookmark"></AtIcon>
          </View>
        </View>
        <View>
          <View className={styles.rimeContainer}>
            <View className={styles.rimePosition}>连续</View>
            <View>bung1</View>
            <View>
              <AtIcon value="volume-plus"></AtIcon>
            </View>
          </View>
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
              <View>
                <View>
                  <View>1. 指将龙舟翻转的动作</View>
                  <View className={styles.sentence}>反过（过去）</View>
                  <View className={styles.sentence}>反过去</View>
                </View>
                <View></View>
              </View>
              <View className={styles.source}>来源：诸神的游戏 [M]</View>
            </View>
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={1}>
            <View className={styles.tabPane}>暂无例句</View>
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={2}>
            <View className={styles.tabPane}>音韵</View>
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={3}>
            <View className={clsx(styles.tabPane, styles.collection)}>
              <WordCard
                title={
                  <View className={styles.title}>《诸神的游戏》官方词表</View>
                }
                description="福州龙船文化词汇全搜罗，一起来做龙癫吧！本书京宝热销中https://tao..."
                actions={<AtIcon value="heart"></AtIcon>}
              />
            </View>
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={4}>
            <View className={styles.tabPane}>故事</View>
          </AtTabsPane>
        </AtTabs>
      </View>
    </View>
  );
};

export default Detail;
