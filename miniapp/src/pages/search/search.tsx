import React, { useState, useEffect } from "react";
import Taro, { useRouter } from "@tarojs/taro";
import { View, Input, Block } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import Header from "@/pages/header/header";
import WordCard from "@/components/wordCard/wordCard";
import styles from "./search.module.scss";

const Search = () => {
  const router = useRouter();
  const [inputString, setInputString] = useState("");
  const [showAdvanced, toggleAdvanced] = useState(false);

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
          <Block>
            <View
              className={`${styles.resultTitle} at-row at-row__justify--between at-row__align--center`}
            >
              <View className={styles.resultAmount}>找到 1 个结果</View>
              <View onClick={handleAdvancedSearch}>高级搜索</View>
            </View>
            <WordCard
              title="我"
              description="来源：诸神的游戏 [M]"
              extraList={[
                { title: "榕拼", content: "bung1" },
                { title: "音韵地位", content: "邊春 上平" },
              ]}
            />
          </Block>
        )}
      </View>
    </View>
  );
};

export default Search;
