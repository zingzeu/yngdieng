import React, {useState} from 'react';
import Taro from '@tarojs/taro';
import {View} from '@tarojs/components';
import styles from './survey-banner.module.scss';
import {AtIcon} from 'taro-ui';

const STORAGE_KEY_SURVEY_DISMISS_TIMESTAMP = 'hasDismissedSurvey';
const DISMISS_TIMEOUT_MS = 2 * 24 * 3600 * 1000; // 2 days

const SurveyBanner = () => {
  let lastDismissTimestamp =
    Taro.getStorageSync(STORAGE_KEY_SURVEY_DISMISS_TIMESTAMP) || 0;
  let shouldShowBanner = Date.now() - lastDismissTimestamp > DISMISS_TIMEOUT_MS;
  let isShowingNavigationPrompt = false;
  let [showingBanner, setShowingBanner] = useState(shouldShowBanner);
  const handleSurveyClicked = () => {
    if (isShowingNavigationPrompt) {
      return;
    }
    isShowingNavigationPrompt = true;
    // TODO: telemetry
    Taro.navigateToMiniProgram({
      // 问卷星
      appId: 'wxd947200f82267e58',
      path: 'pages/wjxqList/wjxqList?activityId=eS3I20a',
      success: () => {
        // TODO: telemetry
        Taro.setStorageSync(STORAGE_KEY_SURVEY_DISMISS_TIMESTAMP, Date.now());
        setShowingBanner(false);
      },
      complete: () => {
        isShowingNavigationPrompt = false;
      },
    });
  };
  const handleClose = e => {
    e[0].stopPropagation();
    Taro.setStorageSync(STORAGE_KEY_SURVEY_DISMISS_TIMESTAMP, Date.now());
    setShowingBanner(false);
  };
  return (
    showingBanner && (
      <View className={styles.banner} onClick={handleSurveyClicked}>
        邀您参加 👉<View className={styles.bannerAnchor}>榕典用户调研</View>👈
        <AtIcon
          className={styles.close}
          onClick={handleClose}
          value="close"
        ></AtIcon>
      </View>
    )
  );
};

export default SurveyBanner;
