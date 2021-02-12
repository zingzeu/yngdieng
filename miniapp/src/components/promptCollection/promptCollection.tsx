import React, {useState} from 'react';
import Taro, {useDidShow} from '@tarojs/taro';
import clsx from 'clsx';
import {View, Image} from '@tarojs/components';

import styles from './promptCollection.module.scss';

let havePrompted = Taro.getStorageSync('haveCollectionPrompted');

const PromptCollection = () => {
  const [shouldShow, toggleShow] = useState(false);

  const handleClosePrompt = () => {
    toggleShow(false);
  };

  useDidShow(() => {
    if (havePrompted) return;
    Taro.setStorageSync('haveCollectionPrompted', true);
    toggleShow(true);
    havePrompted = true;
  });
  return shouldShow ? (
    <View
      className={clsx(styles.mask, shouldShow && styles.active)}
      onClick={handleClosePrompt}
    >
      <Image
        mode='widthFix'
        src='cloud://yngdieng-id6e0.796e-yngdieng-id6e0-1302960777/images/提示收藏.svg'
      />
    </View>
  ) : null;
};

export default PromptCollection;