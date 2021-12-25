import { Block, View, Image, Text } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './start.scss'


const app = Taro.getApp()

@withWeapp({
  data: {
    remind: '加载中',
    angle: 0,
    userInfo: {}
  },
  goToIndex: function() {
    Taro.switchTab({
      url: '/pages/index/index'
    })
  },
  onLoad: function() {
    var that = this
    Taro.setNavigationBarTitle({
      title: "标题"
    })

    var that = this
    Taro.request({
      url: 'https://one.siuze.top/GetRandData',
      method: 'post',
      data: { src: app.globalData.language },
      success: function(res) {
        app.globalData.word = res.data.data.word
        app.globalData.sigp = res.data.data.sping
        ;(app.globalData.sigr = res.data.data.rping),
          (app.globalData.zid = res.data.data.zid)
        app.globalData.detail = res.data.data.detail
        app.globalData.pth = res.data.data.pth
        ;(app.globalData.show_word = res.data.data.word),
          console.log('succeed!')
        console.log(res.data.data)
      }
    })
  },
  onShow: function() {
    let that = this
  },
  onReady: function() {
    var that = this
    setTimeout(function() {
      that.setData({
        remind: ''
      })
    }, 1000)
    Taro.onAccelerometerChange(function(res) {
      var angle = -(res.x * 30).toFixed(1)
      if (angle > 14) {
        angle = 14
      } else if (angle < -14) {
        angle = -14
      }
      if (that.data.angle !== angle) {
        that.setData({
          angle: angle
        })
      }
    })
  }
})
class StartPage extends React.Component {
  render() {
    const { remind, angle } = this.data
    return (
      <View className="container">
        {remind ? (
          <View className="remind-box">
            <Image
              className="remind-img"
              src={require('../../images/more/loading.gif')}
            ></Image>
          </View>
        ) : (
          <Block>
            <Image
              className="title"
              src={require('../../images/backmoon.png')}
            ></Image>
            <View className="content">
              <View
                className="hd"
                style={'transform:rotateZ(' + angle + 'deg);'}
              >
                <Image
                  className="wave1"
                  src={require('../../images/more/wave.png')}
                  mode="aspectFill"
                ></Image>
                <Image
                  className="wave1 wave-bg"
                  src={require('../../images/more/wave.png')}
                  mode="aspectFill"
                ></Image>
              </View>
              <View className="bd">
                <Image
                  className="smalltitle"
                  src={require('../../images/coverintro.png')}
                ></Image>
                <View className="confirm-btn" onClick={this.goToIndex}>
                  <Text>进入小程序</Text>
                </View>
                <Text className="copyright">
                  © 2021 Zingzeu. All rights reserved.
                </Text>
              </View>
            </View>
          </Block>
        )}
      </View>
    )
  }
}

export default StartPage