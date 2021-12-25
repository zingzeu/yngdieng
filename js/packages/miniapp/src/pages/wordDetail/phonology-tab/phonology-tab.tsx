import React from 'react';
import clsx from 'clsx';
import {AtIcon} from 'taro-ui';
import {View} from '@tarojs/components';
import AudioPlay from '@/components/audioPlay/audioPlay';
import styles from './phonology-tab.module.scss';

const PhonologyTab = ({audioCards}) => {
  return (
    <View className={clsx(styles.pronounce, 'at-row')}>
      {audioCards.map(pronounce => {
        return (
          <View className="at-col at-col-6">
            <View className={styles.card}>
              <View
                className={clsx(
                  styles.title,
                  'at-row at-row__justify--between at-row__align--center'
                )}
              >
                <View className={styles.name}>
                  {pronounce.pronunciation || ''}
                </View>
                {pronounce.audio && (
                  <AudioPlay
                    audioFileId={pronounce.audio.remote_urls.remote_urls[0]}
                  />
                )}
              </View>
              <View>{pronounce.hint_primary || ''}</View>
              <View className="at-row at-row__justify--between at-row__align--center">
                <View>{pronounce.hint_secondary || ''}</View>
                <View>
                  <AtIcon value="heart"></AtIcon> {2}
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default PhonologyTab;
