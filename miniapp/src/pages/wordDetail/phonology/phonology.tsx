import React from 'react';
import clsx from 'clsx';
import {AtIcon} from 'taro-ui';
import {View} from '@tarojs/components';
import styles from './phonology.module.scss';

const Phonology = ({wordDetail}) => {
  return (
    <View className={clsx(styles.pronounce, 'at-row')}>
      {wordDetail.pronouncesFromDifferentSpeakers.map(pronounce => {
        return (
          <View className="at-col at-col-6">
            <View className={styles.card}>
              <View className="at-row at-row__justify--between at-row__align--center">
                <View className={styles.name}>{pronounce.name}</View>
                <View>
                  <AtIcon value="volume-plus"></AtIcon>
                </View>
              </View>
              <View>
                {pronounce.speaker.name} | {pronounce.speaker.age}岁 |{' '}
                {pronounce.speaker.gender}
              </View>
              <View className="at-row at-row__justify--between at-row__align--center">
                <View>{pronounce.speaker.area}</View>
                <View>
                  <AtIcon value="heart"></AtIcon> {pronounce.likes}
                </View>
              </View>
            </View>
          </View>
        );
      })}
      {wordDetail.transcriptions.map(transcription => (
        <View className="at-col at-col-6">
          <View className={styles.card}>
            <View>{transcription.value}</View>
            <View>{transcription.source}</View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default Phonology;
