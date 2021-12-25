import { Block } from "@tarojs/components";
import React from "react";
import Taro from "@tarojs/taro";
import withWeapp from "@tarojs/with-weapp";
import "./app.scss";

@withWeapp({
  globalData: {
    WXid: "",
    userInfo: null,
    rank: 0,
    ad_region: "",
    address: "",
    region: "",
    name: "",
    telephone: "",
    avatar: "",
    clock: -1,
    passed: 0,
    submitted: 0,
    failed: 0,
    score: 0,
    word: "",
    sigp: "",
    sigr: "",
    zid: "",
    detail: "",
    language: "",
    pth: ""
  },

  watch: function (method) {
    var obj = this.globalData;
    Object.defineProperty(obj, 'clock', {
      configurable: true,
      enumerable: true,
      set: function (value) {
        this._name = value;
        // vaule=this
        var that = this;
        method(value, Taro.getCurrentPages());
      },
      get: function () {
        return this._name;
      }
    });
  },
  onLaunch: function () {
    // 展示本地存储能力
    //   (async () => {
    //     const p = await new Promise(resolve => {
    //         setTimeout(() => resolve("hello async/await"), 1000);
    //     });
    //     console.log(p);
    // })();
    var that = this;
    var logs = Taro.getStorageSync('logs') || [];
    logs.unshift(Date.now());

    Taro.setStorageSync('logs', logs);
    // wx.showToast({
    //   title: '加载必要组件中',
    //   icon: 'loading',
    //   duration: 5000
    // })
    // 登录
    Taro.login({
      success: res => {
        var code = res.code; //登录凭证
        if (code) {
          //2、调用获取用户信息接口
          // wx.getUserInfo({
          //   success: function (res) {
          //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
          Taro.request({
            url: 'https://one.siuze.top/GetSession', //自己的服务接口地址
            method: 'post',
            header: {
              'content-type': 'application/json'
            },
            data: { encryptedData: res.encryptedData, iv: res.iv, code: code },
            success: function (res) {
              // console.log(res.data)
              //4.解密成功后 获取自己服务器返回的结果
              if (res.data.return_code == 0) {
                console.log(res.data);
                // that=this
                that.globalData.WXid = res.data.UserSession;
                console.log(that.globalData.WXid);
                Taro.request({
                  url: 'https://one.siuze.top/Confirm', //自己的服务接口地址
                  method: 'post',
                  header: {
                    'content-type': 'application/json'
                  },
                  data: { WXid: res.data.UserSession, submit: 1 },
                  success: function (res) {
                    console.log(res.data);

                    that.globalData.rank = res.data.isManager;
                    var n = -1;
                    if (res.data.address != null) {
                      n = res.data.address.lastIndexOf("，");
                    }
                    if (n > 0) {
                      that.globalData.ad_region = res.data.address.substring(0, n);
                      that.globalData.address = res.data.address.substring(n + 1);
                    } else {
                      that.globalData.address = res.data.address;
                    }
                    that.globalData.region = res.data.region;
                    that.globalData.submitted = res.data.submitted;
                    that.globalData.passed = res.data.passed;
                    that.globalData.score = res.data.score;
                    that.globalData.failed = res.data.failed;
                    that.globalData.telephone = res.data.telephone;
                    that.globalData.avatar = res.data.avatar;
                    that.globalData.name = res.data.name;
                    // wx.showToast({
                    //   title: '登录成功',
                    //   icon: 'success',
                    //   duration: 1000
                    // })
                  },
                  fail: function () {
                    Taro.showToast({
                      title: '登录失败',
                      icon: 'success',
                      duration: 2000
                    });
                    console.log('登录失败');
                  }
                });
              } else {
                console.log('解密失败');
              }
            },
            fail: function () {
              console.log('系统错误');
              // }
              // })
            },
            fail: function () {
              console.log('获取用户信息失败');
            }
          });
        } else {
          console.log('获取用户登录态失败！' + r.errMsg);
        }
      }
    });

    Taro.getStorage({
      key: 'language',
      success(res) {
        console.log("获取语言缓存成功");
        console.log(res.data);
        that.globalData.language = res.data;
      },
      fail() {
        that.globalData.language = "榕";
      }
    });
    Taro.loadFontFace({
      family: 'yngdieng-ext-1',
      global: true,
      source: 'url("https://www.ydict.net/assets/fonts/yngdieng-extended-1.woff")',
      success: res => {
        console.log('font load success', res);
      },
      fail: err => {
        console.log('font load fail', err);
      }
    });
  }

}, true)
class App extends React.Component {
  render() {
    return this.props.children;
  }

} //app.js


export default App;