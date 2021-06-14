import React, {Component} from 'react';
import Taro from '@tarojs/taro';
import {Provider} from 'react-redux';
import configStore from './store';
import './styles/custom-variables.scss';
import './app.scss';

const store = configStore();

Taro.cloud.init();

const loadFonts = async () => {
  const fonts = [
    {
      fileId:
        'cloud://yngdieng-id6e0.796e-yngdieng-id6e0-1302960777/font/yngdieng-extended-0.ttf',
      family: 'Ext-0',
    },
    {
      fileId:
        'cloud://yngdieng-id6e0.796e-yngdieng-id6e0-1302960777/font/yngdieng-extended-0.woff',
      family: 'Ext-0',
    },
    {
      fileId:
        'cloud://yngdieng-id6e0.796e-yngdieng-id6e0-1302960777/font/yngdieng-extended-1.ttf',
      family: 'Ext-1',
    },
    {
      fileId:
        'cloud://yngdieng-id6e0.796e-yngdieng-id6e0-1302960777/font/yngdieng-extended-1.woff',
      family: 'Ext-1',
    },
  ];
  const tempFileURLResult = await await Taro.cloud.getTempFileURL({
    fileList: fonts.map(font => font.fileId),
  });
  for (let font of fonts) {
    try {
      const fontFromCloud = tempFileURLResult.fileList.find(
        file => file.fileID === font.fileId
      );
      if (!fontFromCloud) continue;
      Taro.loadFontFace({
        global: true,
        family: font.family,
        source: `url("${fontFromCloud.tempFileURL}")`,
        success: console.log,
      });
    } catch (e) {
      console.log('fetch font failed', font, e);
    }
  }
};

class App extends Component {
  componentDidMount() {
    loadFonts();

    // iOS 设备如果侧边的静音开关打开，默认情况播放会无声。此设置忽略 iOS 的静音开关。
    // 参见 https://developers.weixin.qq.com/community/develop/doc/0004a810988f50e89a37fe5f45b000
    Taro.setInnerAudioOption({
      obeyMuteSwitch: false,
    });
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
