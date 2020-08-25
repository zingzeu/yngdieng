import React, { useState } from "react";
import Taro from "@tarojs/taro";
import { View, Image, Input, Text } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import "taro-ui/dist/style/index.scss";
import Header from "@/pages/header/header";
import routes from "@/routes";
import logoURL from "@/assets/logo.png";
import styles from "./index.module.scss";

const Index = () => {
  const [inputString, setInputString] = useState("");

  const handleConfirm = () => {
    Taro.navigateTo({
      url: `${routes.SEARCH}?word=${inputString}`,
    });
  };

  return (
    <View className={styles.index}>
      <Header />
      <View className={styles.banner}>
        <View />
        <View className={styles.imageContainer}>
          <Image src={logoURL} mode="widthFix" />
        </View>
        <View className={styles.search}>
          <View className={styles.inputContainer}>
            <Input
              value={inputString}
              confirmType="search"
              placeholder="查字、词、读音..."
              onInput={(e) => setInputString(e.detail.value)}
              onConfirm={handleConfirm}
            />
          </View>
          <View className={styles.confirmBtn} onClick={handleConfirm}>
            <AtIcon value="search"></AtIcon>
          </View>
          <View className={styles.actions}>
            <Text onClick={() => Taro.navigateTo({ url: routes.SEARCH })}>
              高级搜索
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Index;
