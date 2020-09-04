import React from 'react';
import Taro from '@tarojs/taro';
import clsx from 'clsx';
import {AtIcon} from 'taro-ui';
import {View} from '@tarojs/components';
import styles from './phonology.module.scss';

const Phonology = ({wordDetail}) => {
  const handlePlayAudio = audioFileId => () => {
    const ctx = Taro.createInnerAudioContext();
    ctx.src = audioFileId;
    ctx.play();
  };

  return (
    <View className={clsx(styles.pronounce, 'at-row')}>
      {wordDetail.pronouncesFromDifferentSpeakers.map(pronounce => {
        return (
          <View className="at-col at-col-6">
            <View className={styles.card}>
              <View
                className={clsx(
                  styles.title,
                  'at-row at-row__justify--between at-row__align--center'
                )}
              >
                <View className={styles.name}>{pronounce.name}</View>
                <View onClick={handlePlayAudio(pronounce.audioFileId)}>
                  <AtIcon value="volume-plus"></AtIcon>
                </View>
              </View>
              <View>
                {pronounce.speaker.name} | {pronounce.speaker.age || '--'}岁 |{' '}
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
            <View>{transcription.name}</View>
          </View>
        </View>
      ))}
      <View className="at-col at-col-12"></View>
      {wordDetail.wordSplited.map(wordFragment => (
        <View className="at-col at-col-4">
          <View className={styles.card}>
            <View>{wordFragment.word}</View>
            <View>{wordFragment.pinyin}</View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default Phonology;
