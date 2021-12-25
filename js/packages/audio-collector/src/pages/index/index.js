import { Block, View, Image, Switch, Text, Button } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './index.scss'
const app = Taro.getApp()
var util = require('../../utils/util.js')

@withWeapp({
  data: {
    record_state: 0,
    animationData1: '',
    animationData2: '',
    animationStatus: false,
    word_label: '推荐用字',
    language: '榕',
    switch_value: false,
    word: Taro.getApp().globalData.word, //推荐用字
    show_word: Taro.getApp().globalData.word, //推荐用字
    sigp: Taro.getApp().globalData.sigp, //市区单字
    sigr: Taro.getApp().globalData.sigr, //市区连读
    zid: Taro.getApp().globalData.zid,
    detail: Taro.getApp().globalData.detail, //词条释义
    show_detail: Taro.getApp().globalData.detail, //词条释义
    pth: Taro.getApp().globalData.pth,
    isRecording: false, //是否正在录音
    wave_begin: false, //是否启动波浪
    more: -1, //释义是否展开
    modalName: 'init' //按下下一条按钮时候的检查提问框
  },
  onLoad: function(options) {
    var that = this
    if (Taro.getApp().globalData.language == '榕') {
      that.setData({
        language: '榕',
        word: Taro.getApp().globalData.word, //推荐用字
        show_word: Taro.getApp().globalData.word, //推荐用字
        sigp: Taro.getApp().globalData.sigp, //市区单字
        sigr: Taro.getApp().globalData.sigr, //市区连读
        zid: Taro.getApp().globalData.zid,
        detail: Taro.getApp().globalData.detail, //词条释义
        show_detail: Taro.getApp().globalData.detail, //词条释义
        pth: Taro.getApp().globalData.pth,
        word_label: '推荐用字',
        switch_value: false
      })
    } else if (Taro.getApp().globalData.language == '普') {
      that.setData({
        language: '普',
        word: Taro.getApp().globalData.word, //推荐用字
        show_word: Taro.getApp().globalData.pth, //推荐用字
        sigp: Taro.getApp().globalData.sigp, //市区单字
        sigr: Taro.getApp().globalData.sigr, //市区连读
        zid: Taro.getApp().globalData.zid,
        detail: Taro.getApp().globalData.detail, //词条释义
        pth: Taro.getApp().globalData.pth,
        word_label: '普通话对应',
        switch_value: true,
        show_detail:
          '【' +
          Taro.getApp().globalData.word +
          '】 ' +
          Taro.getApp().globalData.detail
      })
    }
    //获取全局唯一的录音管理器 RecorderManager实例
    that.recorderManager = Taro.getRecorderManager()
    that.recorderManager.onStop(res => {
      that.setData({
        tempFilePath: res.tempFilePath // 文件临时路径
      })
      console.log('获取到文件：' + that.data.tempFilePath)
    })
    this.recorderManager.onError(res => {
      console.log('录音失败了！')
      //console.log(res)
    })
  },
  more_detail() {
    //展开词条释义和关闭
    this.setData({
      more: -this.data.more
    })
  },
  startORplay() {
    //录音或者播放按钮
    if (this.data.record_state == 0) {
      this.start()
    } else {
      this.play()
    }
  },
  stopORempty() {
    if (this.data.record_state == 0) {
      this.stop()
    }
  },
  //开始录音
  start: function() {
    this.recorderManager.start({
      duration: 60000,
      sampleRate: 44100, //采样率，有效值 8000/16000/44100
      numberOfChannels: 1, //录音通道数，有效值 1/2
      encodeBitRate: 320000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      frameSize: 5, //指定帧大小
      audioSource: 'auto' //指定录音的音频输入源，可通过 wx.getAvailableAudioSources() 获取
    })
    this.setData({
      animationStatus: true
    })
    this.animationFun('animationData1')
    setTimeout(() => {
      this.animationFun('animationData2')
    }, 500)
    setTimeout(() => {
      this.animationRest()
    }, 1000)
    var that = this
    that.setData({
      isRecording: true, // 文件临时路径
      wave_begin: true
    })
  },
  //录音暂停
  suspend: function() {
    this.recorderManager.pause()
  },
  //继续录音
  continue: function() {
    this.recorderManager.resume()
  },
  //录音停止
  stop: function() {
    var that = this
    that.setData({
      isRecording: false, // 文件临时路径
      wave_begin: false
    })
    this.recorderManager.stop()
    //动画1结束
    var animation1 = Taro.createAnimation({
      duration: 0
    })
    animation1
      .opacity(1)
      .scale(1, 1)
      .step()
    //动画2结束
    var animation2 = Taro.createAnimation({
      duration: 0
    })
    animation2
      .opacity(1)
      .scale(1, 1)
      .step()
    this.setData({
      animationData1: animation1.export(),
      animationData2: animation2.export(),
      animationStatus: false,
      record_state: 1
    })
  },
  //播放录音
  play: function() {
    // 获取innerAudioContext实例
    const innerAudioContext = Taro.createInnerAudioContext()
    // 是否自动播放
    innerAudioContext.autoplay = true
    // 设置音频文件的路径
    innerAudioContext.src = this.data.tempFilePath
    // 播放音频文件
    innerAudioContext.onPlay(() => {
      // console.log('开始播放')
      this.setData({
        animationStatus: true
      })
      this.animationFun('animationData1')
      setTimeout(() => {
        this.animationFun('animationData2')
      }, 500)
      setTimeout(() => {
        this.animationRest()
      }, 1000)
      var that = this
      that.setData({
        isRecording: true, // 文件临时路径
        wave_begin: true
      })
    })
    // 监听音频播放错误事件
    innerAudioContext.onError(res => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    innerAudioContext.onEnded(() => {
      console.log('结束播放')
      //动画1结束
      var animation1 = Taro.createAnimation({
        duration: 0
      })
      animation1
        .opacity(1)
        .scale(1, 1)
        .step()
      //动画2结束
      var animation2 = Taro.createAnimation({
        duration: 0
      })
      animation2
        .opacity(1)
        .scale(1, 1)
        .step()
      this.setData({
        isRecording: false, // 文件临时路径
        wave_begin: false,
        animationData1: animation1.export(),
        animationData2: animation2.export(),
        animationStatus: false
      })
    })
  },

  randchange() {
    //换一条
    if (this.data.record_state != 0) {
      //如果本地有录音的话要弹出窗口提示
      this.setData({
        modalName: 'bottomModal'
      })
      return
    }
    this.setData({
      //启动刷新动画
      wave_begin: true,
      record_state: 0
    })
    Taro.showToast({
      title: '获取中',
      icon: 'loading',
      duration: 7000
    })
    var that = this
    app.globalData.clock = -app.globalData.clock
    Taro.request({
      url: 'https://one.siuze.top/GetRandData',
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      data: { src: this.data.language },
      success: function(res) {
        that.setData(
          {
            word: res.data.data.word,
            sigp: res.data.data.sping,
            sigr: res.data.data.rping,
            zid: res.data.data.zid,
            detail: res.data.data.detail,
            show_detail: res.data.data.detail,
            wave_begin: false,
            pth: res.data.data.pth,
            show_word: res.data.data.word
          },
          () => {
            console.log('赋值成功')
            if (that.data.language == '普') {
              that.setData({
                show_word: res.data.data.pth,
                show_detail: '【' + that.data.word + '】 ' + that.data.detail,
                wave_begin: false
              })
            }
          }
        )

        // console.log('succeed!');
        // console.log(res.data);
        Taro.showToast({
          title: '获取成功',
          icon: 'success',
          duration: 250
        })
      }
    })
  },
  onReady() {
    //暂时没用
    // var that = this;
    // wx.request( {
    //   url: "https://one.siuze.top/GetRandData",
    //   success: function( res ) {
    //     that.setData( {
    //       word: res.data.data.word,
    //       sigp: res.data.data.sping,
    //       sigr: res.data.data.rping,
    //       zid:res.data.data.zid,
    //       detail: res.data.data.detail,
    //     })
    //     console.log('succeed!');
    //     console.log(res.data.data);
    //   }
    // })
  },
  upload: function(e) {
    //上传录音按钮
    if (this.data.record_state == 0) {
      //本地若没有录音文件
      Taro.showToast({
        title: '您尚未录音',
        icon: 'error',
        duration: 1000
      })
    }
    Taro.showToast({
      title: '上传中',
      icon: 'loading',
      duration: 4000
    })
    const innerAudioContext = Taro.createInnerAudioContext() // 设置音频文件的路径
    innerAudioContext.src = this.data.tempFilePath //上传录音文件
    var that = this
    // console.log(that.data.zid)
    var uploadTask = Taro.uploadFile({
      //没有method，自动为POST请求
      filePath: this.data.tempFilePath,
      name: 'file', //这个随便填
      formData: {
        filename: util.formatTime(new Date()),
        WXid: app.globalData.WXid,
        zid: that.data.zid,
        rping: that.data.sigr,
        language: that.data.language
      },
      url: 'https://one.siuze.top/NewAudio', //填写自己服务器的地址。
      header: {
        'Content-Type': 'multipart/form-data' //必须是这个格式
      },
      success: e => {
        if (res.data.message == 'success') {
          Taro.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
          that.setData(
            {
              record_state: 0
            },
            () => {
              console.log('赋值成功')
              if (e == 'rand') this.randchange()
            }
          )
        } else {
          if (res.data.session_state == -1) {
            Taro.showToast({
              title: '账户过期，请重新进入小程序',
              icon: 'error',
              duration: 5000
            })
          } else {
            Taro.showToast({
              title: '上传失败',
              icon: 'error',
              duration: 2000
            })
          }
        }
      },
      fail: e => {
        Taro.showToast({
          title: '上传出错',
          icon: 'error',
          duration: 2000
        })
      }
    })
    // uploadTask.onProgressUpdate((e) => {
    //   console.log(e);
    //   console.log('期望上传的总字节数：' + e.totalBytesExpectedToSend);
    //   console.log('已经上传的字节数' + e.totalBytesSent);
    // })
  },

  //下面几个是按下录音按钮时候的动画相关函数
  animationFun: function(animationData) {
    if (!this.data.animationStatus) {
      return
    }
    var animation = Taro.createAnimation({
      duration: 1000
    })
    animation
      .opacity(0)
      .scale(2, 2)
      .step()
    this.setData({
      [`${animationData}`]: animation.export()
    })
  },
  animationEnd: function(animationData) {
    var animation = Taro.createAnimation({
      duration: 0
    })
    animation
      .opacity(1)
      .scale(1, 1)
      .step()
    this.setData({
      [`${animationData}`]: animation.export()
    })
  },
  recodeEnd: function() {
    //动画1结束
    var animation1 = Taro.createAnimation({
      duration: 0
    })
    animation1
      .opacity(1)
      .scale(1, 1)
      .step()
    //动画2结束
    var animation2 = Taro.createAnimation({
      duration: 0
    })
    animation2
      .opacity(1)
      .scale(1, 1)
      .step()
    this.setData({
      animationData1: animation1.export(),
      animationData2: animation2.export(),
      animationStatus: false
    })
  },
  recodeClick: function() {
    this.setData({
      animationStatus: true
    })
    this.animationFun('animationData1')
    setTimeout(() => {
      this.animationFun('animationData2')
    }, 500)
    setTimeout(() => {
      this.animationRest()
    }, 1000)
  },
  animationRest: function() {
    //动画重置
    this.animationEnd('animationData1')
    setTimeout(() => {
      this.animationEnd('animationData2')
    }, 500)
    setTimeout(() => {
      if (this.data.animationStatus) {
        this.recodeClick()
      }
    }, 100)
  },
  rust() {
    //清除录音文件（实际上没有清除，只是标记为空）
    this.stop()
    this.setData({
      record_state: 0
    })
  },
  hideModal() {
    //关闭提示窗口
    this.setData({
      modalName: 'init'
    })
  },
  UpAndRand() {
    //上传条目并下一条
    this.setData(
      {
        modalName: 'init' //关闭提示窗口后
      },
      () => {
        this.upload('rand') //上传录音，之后再刷新条目
      }
    )
  },
  SetLanguage() {
    if (this.data.language == '榕') {
      this.setData({
        switch_value: true,
        language: '普',
        word_label: '普通话对应',
        show_word: this.data.pth,
        show_detail: '【' + this.data.word + '】 ' + this.data.detail
      })
      Taro.setStorage({
        key: 'language',
        data: '普'
      })
    } else if (this.data.language == '普') {
      this.setData({
        switch_value: false,
        language: '榕',
        word_label: '推荐用字',
        show_word: this.data.word,
        show_detail: this.data.detail
      })
      Taro.setStorage({
        key: 'language',
        data: '榕'
      })
    }
  }
})
class _C extends React.Component {
  render() {
    const {
      wave_begin,
      switch_value,
      word_label,
      show_word,
      sigp,
      sigr,
      more,
      show_detail,
      record_state,
      animationData1,
      animationData2,
      modalName
    } = this.data
    return (
      <Block>
        <View className="header1">
          <View>
            <Image
              src={require('../../images/backmoon.png')}
              mode="widthFix"
              className="top_img"
            ></Image>
          </View>
          <Image
            className="bg_ware"
            src={
              wave_begin == true
                ? 'https://codermoyv.gitee.io/coder-moyv/assets/images/wechat/bg_wave.gif'
                : '../../images/bg_wave.png'
            }
          ></Image>
          <View className style="text-align:right; margin-right: 45rpx;">
            <Switch
              className="switch-word"
              onChange={this.SetLanguage}
              checked={switch_value}
            ></Switch>
          </View>
        </View>
        <View className="padding">
          <View className="radius shadow shadow-lg bg-white margin-top flex">
            <View className="cu-list menu" style="padding: 0;">
              <View className="cu-item">
                <View className="content flex align-center">
                  <View className="cu-tag radius">{word_label}</View>
                  <View className="flex-sub text-left">
                    <View
                      className="solid-bottom text-sl padding text-black"
                      style="padding-left:50rpx; line-height:80rpx;"
                    >
                      <Text>{show_word}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View className="cu-item">
                <View className="content flex align-center">
                  <View className="cu-tag radius">市区单字</View>
                  <View className="flex-sub text-left">
                    <View
                      className="solid-bottom text-xl"
                      style="padding-left:50rpx;"
                    >
                      <Text className="text-black">{sigp}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View className="cu-item">
                <View className="content flex align-center">
                  <View className="cu-tag radius">市区连读</View>
                  <View className="flex-sub text-left">
                    <View
                      className="solid-bottom text-xl"
                      style="padding-left:50rpx;"
                    >
                      <Text className="text-black">{sigr}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                className={
                  'cu-item  align-start ' + (more == 1 ? 'arrow-down' : 'arrow')
                }
                onClick={this.more_detail}
              >
                <View className="content flex">
                  <View className="cu-tag radius">词条释义</View>
                  <View className="flex-sub text-left">
                    <View
                      className={
                        'solid-bottom text-lg ' + (more == 1 ? '' : 'text-cut')
                      }
                      style="padding-left:50rpx;width:420rpx"
                    >
                      <Text className>{show_detail}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View
          className="container"
          style="width: 750rpx; height: 788rpx; display: flex; box-sizing: border-box; padding-top: 0rpx"
        >
          <View
            className="myRecode"
            style="display: block; width: 206rpx; height: 290rpx; box-sizing: border-box;padding-top: 50rpx"
          >
            <View
              className="recode"
              onTouchStart={this.startORplay}
              onTouchEnd={this.stopORempty}
              style="padding-top: 10px;"
            >
              <View className="ripple">
                <Image
                  style="width:70% ; height:100%"
                  src={
                    record_state == 0
                      ? '../../images/mic.svg'
                      : '../../images/play.svg'
                  }
                ></Image>
              </View>
              <View className="ripple" animation={animationData1}></View>
              <View className="ripple" animation={animationData2}></View>
            </View>
          </View>
          <Button
            className={
              'cu-btn icon bg-red ' + (record_state == 0 ? 'rusthidden' : '')
            }
            style="position: relative; left: 254rpx;top: -294rpx"
            onClick={this.rust}
          >
            <Text className="cuIcon-delete text-bold"></Text>
          </Button>
          <Button
            className="cu-btn block bg-green margin-tb-sm lg shadow"
            onClick={this.upload}
            style="position: relative; left: 0rpx;width: 300rpx; top: -104rpx"
          >
            <Text className="cuIcon-upload"></Text>上传录音
          </Button>
          <Button
            className="cu-btn block bg-blue margin-tb-sm lg shadow"
            onClick={this.randchange}
            style="position: relative; left: -1rpx; width: 300rpx; top: -92rpx"
          >
            <Text className="cuIcon-down"></Text>换一条
          </Button>
          <View
            className={
              'cu-modal bottom-modal ' +
              (modalName == 'bottomModal' ? 'show' : '')
            }
          >
            <View className="cu-dialog">
              <View className="cu-bar bg-white">
                <View className="action text-green" onClick={this.UpAndRand}>
                  上传并刷新
                </View>
                <View className="action text-blue" onClick={this.hideModal}>
                  取消
                </View>
              </View>
              <View className="padding-xl">
                您的本地存在录音文件，是否先上传这条录音再刷新？
              </View>
            </View>
          </View>
        </View>
      </Block>
    )
  }
}

export default _C
