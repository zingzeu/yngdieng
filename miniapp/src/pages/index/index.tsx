import React, {useState, useEffect} from 'react';
import Taro, {getCurrentInstance, useShareAppMessage, useShareTimeline} from '@tarojs/taro';
import {View, Image, Input} from '@tarojs/components';
import {AtIcon} from 'taro-ui';
import Header from '@/pages/header/header';
import routes from '@/routes';
import logoURL from '@/assets/logo.png';
import styles from './index.module.scss';

const handleRouterParams = () => {
  const scannedURL = decodeURIComponent(
    getCurrentInstance().router?.params.q || ''
  );
  if (!scannedURL) return;
  const splittedURL = scannedURL.split('/');
  const id = splittedURL.pop();
  const type = splittedURL.pop();
  if (type === 'campaign') {
    switch (id) {
      case 'lung-nung-dieng': {
        Taro.reLaunch({
          url: '/pages/collectionDetail/collectionDetail?id=wordLists/1',
        });
        break;
      }
      case 'lung-nung-dieng-2': {
        Taro.reLaunch({
          url: '/pages/collectionDetail/collectionDetail?id=wordLists/2',
        });
        break;
      }
      // 福州客第3期
      case 'foochowka-3': {
        Taro.reLaunch({
          url: '/pages/collectionDetail/collectionDetail?id=wordLists/11',
        });
        break;
      }
    }
  }
};

const Index = () => {
  const [inputString, setInputString] = useState('');

  const handleConfirm = () => {
    Taro.redirectTo({
      url: `${routes.SEARCH}?word=${inputString}`,
    });
  };

  useShareTimeline(() => ({
    title: '福州话电子词典',
  }))
  useShareAppMessage(() => ({
    title: '福州话电子词典',
  }));
  useEffect(() => {
    handleRouterParams();
  }, []);
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
              onInput={e => setInputString(e.detail.value)}
              onConfirm={handleConfirm}
            />
          </View>
          <View className={styles.confirmBtn} onClick={handleConfirm}>
            <AtIcon value="search"></AtIcon>
          </View>
          <View className={styles.actions}></View>
        </View>
      </View>
    </View>
  );
};

export default Index;
