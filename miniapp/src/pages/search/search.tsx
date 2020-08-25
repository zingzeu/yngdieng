import React, { useState, useEffect } from "react";
import Taro, { useRouter } from "@tarojs/taro";
import { View, Input, Block, ScrollView } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import routes from "@/routes";
import Header from "@/pages/header/header";
import WordCard from "@/components/wordCard/wordCard";
import styles from "./search.module.scss";

const mockResultList = [
  {
    id: "1",
    title: "我",
    description: "来源：诸神的游戏 [M]",
    pinyinRong: "bung1",
    rimePosition: "邊春 上平",
  },
  {
    id: "2",
    title: "崩",
    description: "来源：诸神的游戏 [M]",
    pinyinRong: "bung1",
    rimePosition: "邊春 上平",
  },
  {
    id: "3",
    title: "我",
    description: "来源：诸神的游戏 [M]",
    pinyinRong: "bung1",
    rimePosition: "邊春 上平",
  },
  {
    id: "4",
    title: "崩",
    description: "来源：诸神的游戏 [M]",
    pinyinRong: "bung1",
    rimePosition: "邊春 上平",
  },
  {
    id: "5",
    title: "我",
    description: "来源：诸神的游戏 [M]",
    pinyinRong: "bung1",
    rimePosition: "邊春 上平",
  },
  {
    id: "6",
    title: "崩",
    description: "来源：诸神的游戏 [M]",
    pinyinRong: "bung1",
    rimePosition: "邊春 上平",
  },
];

const Search = () => {
  const router = useRouter();
  const [inputString, setInputString] = useState("");
  const [showAdvanced, toggleAdvanced] = useState(false);
  const [resultList, setResultList] = useState(mockResultList);

  const handleConfirm = (word = inputString) => {
    if (inputString !== word) setInputString(word);
    toggleAdvanced(false);
    console.log("search word", word);
  };
  const handleAdvancedSearch = () => {
    setInputString("");
    toggleAdvanced(true);
  };

  useEffect(() => {
    const wordFromParams = router.params.word;
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
                onInput={(e) => setInputString(e.detail.value)}
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
        {showAdvanced && <Block></Block>}
        {!showAdvanced && (
          <View className={styles.result}>
            <View
              className={`${styles.resultTitle} at-row at-row__justify--between at-row__align--center`}
            >
              <View className={styles.resultAmount}>
                找到 {resultList.length} 个结果
              </View>
              <View onClick={handleAdvancedSearch}>高级搜索</View>
            </View>
            <View className={styles.resultList}>
              <ScrollView
                className={styles.scrollView}
                scrollY
                lowerThreshold={20}
                upperThreshold={20}
              >
                {resultList.map((resultItem) => (
                  <View className={styles.resultItem} key={resultItem.id}>
                    <WordCard
                      onClick={() =>
                        Taro.navigateTo({
                          url: `${routes.DETAIL}?id=${resultItem.id}`,
                        })
                      }
                      title={resultItem.title}
                      description={resultItem.description}
                      extraList={[
                        { title: "榕拼", content: resultItem.pinyinRong },
                        { title: "音韵地位", content: resultItem.rimePosition },
                      ]}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default Search;
