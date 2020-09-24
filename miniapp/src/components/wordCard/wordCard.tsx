import React, {ElementType} from 'react';
import {View} from '@tarojs/components';
import styles from './wordCard.module.scss';

interface Props {
  title?: any;
  description?: string;
  extraList?: {
    title: string;
    content: string;
  }[];
  onClick?: Function;
  extra?: any;
  actions?: any;
}

const wordCard = ({
  title = '',
  description = '',
  extraList = [],
  extra = '',
  onClick = () => {},
  actions,
}: Props) => {
  return (
    <View className={styles.wordCard} onClick={() => onClick()}>
      <View>
        <View className="at-row at-row__align--center at-row__justify--between">
          <View className={styles.title}>{title}</View>
          <View>
            <View className={styles.extraContainer}>
              {extraList.map(extraItem => (
                <View key={extraItem.title}>
                  <View className={styles.extraTitle}>{extraItem.title}</View>
                  <View>{extraItem.content}</View>
                </View>
              ))}
              <View>{extra}</View>
            </View>
          </View>
        </View>
        <View className={styles.description}>{description}</View>
        {actions && <View className={styles.actions}>{actions}</View>}
      </View>
    </View>
  );
};

export default wordCard;
