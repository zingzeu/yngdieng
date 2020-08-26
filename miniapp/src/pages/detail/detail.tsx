import React, { useState } from "react";
import clsx from "clsx";
import { View } from "@tarojs/components";
import { AtIcon, AtTabs, AtTabsPane } from "taro-ui";
import Header from "@/pages/header/header";
import styles from "./detail.module.scss";

const Detail = () => {
  const [currentTab, setCurrentTab] = useState(0);

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
            { title: "释义" },
            { title: "更多例句" },
            { title: "音韵" },
            { title: "词表" },
            { title: "故事" },
          ]}
          onClick={setCurrentTab}
        >
          <AtTabsPane current={currentTab} index={0}>
            <View className={clsx(styles.tabPaneContainer, styles.explanation)}>
              <View>
                <View>
                  <View className={styles.text}>1. 指将龙舟翻转的动作</View>
                  <View className={styles.sentence}>反过（过去）</View>
                  <View className={styles.sentence}>反过去</View>
                </View>
                <View></View>
              </View>
              <View className={styles.source}>
                来源：诸神的游戏 [M]
              </View>
            </View>
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={1}>
            <View className={styles.tabPaneContainer}>标签页二的内容</View>
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={2}>
            <View className={styles.tabPaneContainer}>标签页三的内容</View>
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={3}>
            <View className={styles.tabPaneContainer}>标签页四的内容</View>
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={4}>
            <View className={styles.tabPaneContainer}>标签页五的内容</View>
          </AtTabsPane>
        </AtTabs>
      </View>
    </View>
  );
};

export default Detail;
