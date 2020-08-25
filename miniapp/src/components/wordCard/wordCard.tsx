import React from "react";
import { View, Block } from "@tarojs/components";
import styles from "./wordCard.module.scss";

interface Props {
  title: string;
  description: string;
  extraList: {
    title: string;
    content: string;
  }[];
  extra?: any;
}

const wordCard = ({
  title = "",
  description = "",
  extraList = [],
  extra = <Block />,
}: Props) => {
  return (
    <View className={styles.wordCard}>
      <View>
        <View className="at-row at-row__align--center at-row__justify--between">
          <View className={styles.title}>{title}</View>
          <View>
            <View className={styles.extraContainer}>
              {extraList.map((extraItem) => (
                <View>
                  <View className={styles.extraTitle}>{extraItem.title}</View>
                  <View>{extraItem.content}</View>
                </View>
              ))}
              <View>{extra}</View>
            </View>
          </View>
        </View>
        <View className={styles.description}>{description}</View>
      </View>
    </View>
  );
};

export default wordCard;
