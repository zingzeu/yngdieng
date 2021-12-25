import { Block, View, Image, Text, Button } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import { LuckyGrid } from '@lucky-canvas/taro/react'
import './luck.scss'
const app = Taro.getApp()

@withWeapp({
  data: {
    index: 0,
    score: 0,
    prizes: [
      {
        x: 0,
        y: 0,
        imgs: [
          {
            src: 'https://siuze.top/pic/default-0.png',
            activeSrc: 'https://siuze.top/pic/active-0.png',
            width: '100%',
            borderRadius: '10rpx'
          }
        ]
      },
      {
        x: 1,
        y: 0,
        imgs: [
          {
            src: 'https://siuze.top/pic/default-1.png',
            activeSrc: 'https://siuze.top/pic/active-1.png',
            width: '100%',
            borderRadius: '10rpx'
          }
        ]
      },
      {
        x: 2,
        y: 0,
        imgs: [
          {
            src: 'https://siuze.top/pic/default-2.png',
            activeSrc: 'https://siuze.top/pic/active-2.png',
            width: '100%',
            borderRadius: '10rpx'
          }
        ]
      },
      {
        x: 2,
        y: 1,
        imgs: [
          {
            src: 'https://siuze.top/pic/default-3.png',
            activeSrc: 'https://siuze.top/pic/active-3.png',
            width: '100%',
            borderRadius: '10rpx'
          }
        ]
      },
      {
        x: 2,
        y: 2,
        imgs: [
          {
            src: 'https://siuze.top/pic/default-4.png',
            activeSrc: 'https://siuze.top/pic/active-4.png',
            width: '100%',
            borderRadius: '10rpx'
          }
        ]
      },
      {
        x: 1,
        y: 2,
        imgs: [
          {
            src: 'https://siuze.top/pic/default-5.png',
            activeSrc: 'https://siuze.top/pic/active-5.png',
            width: '100%',
            borderRadius: '10rpx'
          }
        ]
      },
      {
        x: 0,
        y: 2,
        imgs: [
          {
            src: 'https://siuze.top/pic/default-6.png',
            activeSrc: 'https://siuze.top/pic/active-6.png',
            width: '100%',
            borderRadius: '10rpx'
          }
        ]
      },
      {
        x: 0,
        y: 1,
        imgs: [
          {
            src: 'https://siuze.top/pic/default-7.png',
            activeSrc: 'https://siuze.top/pic/active-7.png',
            width: '100%',
            borderRadius: '10rpx'
          }
        ]
      }
    ],
    defaultStyle: {},
    blocks: [
      { padding: '10px', background: '#f9f3e4' },
      { padding: '10px', background: '#ffffff' }
    ],
    buttons: [
      {
        x: 1,
        y: 1,
        background: 'rgba(0,0,0,0)',
        imgs: [
          {
            src: 'https://siuze.top/pic/btn.png',
            width: '100%',
            height: '100%'
          }
        ]
      }
    ]
  },
  check_info() {
    if (app.globalData.name == '' || app.globalData.name == null) {
      return -1
    }
    if (app.globalData.telephone == '' || app.globalData.telephone == null) {
      return -1
    }
    if (app.globalData.region == '' || app.globalData.region == null) {
      return -1
    }
    if (app.globalData.ad_region == '' || app.globalData.ad_region == null) {
      return -1
    }
    if (app.globalData.address == '' || app.globalData.address == null) {
      return -1
    }
    return 0
  },
  check_start() {
    if (app.globalData.score < 10) {
      this.setData({
        modalName: 'score'
      })
      return
    }
    if (this.check_info() == -1) {
      this.setData({
        modalName: 'info'
      })
      return
    }
    this.setData({
      modalName: 'begin'
    })
  },
  cancel() {
    this.setData({
      modalName: 'origin'
    })
  },
  start() {
    app.globalData.score = app.globalData.score - 10
    var that = this
    this.setData({
      modalName: 'run',
      score: this.data.score - 10
    })
    Taro.request({
      url: 'https://one.siuze.top/getPrize', //自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      data: {
        WXid: app.globalData.WXid
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.session_state == 1) {
          that.setData({
            index: res.data.prize,
            prize_desc: res.data.prize_desc
          })
          Taro.showToast({
            title: '成功',
            icon: 'success',
            duration: 500
          })
        } else {
          Taro.showToast({
            title: '提交失败',
            icon: 'error',
            duration: 2000
          })
          return
        }
      },
      fail: function () {
        console.log('失败')
        Taro.showToast({
          title: '提交失败',
          icon: 'error',
          duration: 2000
        })
        return
      }
    })
    // 获取抽奖组件实例
    const child = this.selectComponent('#myLucky')
    // 调用play方法开始旋转
    child.$lucky.play()
    // 用定时器模拟请求接口
    setTimeout(() => {
      // 3s 后得到中奖索引 (假设抽到第0个奖品)
      console.log(this.data.index)
      // 调用stop方法然后缓慢停止
      child.$lucky.stop(this.data.index)
    }, 3000)
  },
  to_modify() {
    Taro.navigateTo({
      url: '/pages/info/modify/modify'
    })
  },
  end(event) {
    // 中奖奖品详情
    this.setData({
      modalName: 'end'
    })
    console.log(event.detail)
  },
  onLoad() {
    this.setData({
      score: app.globalData.score
    })
  }
})
class _C extends React.Component {
  render() {
    const {
      score,
      modalName,
      prize_desc,
      blocks,
      prizes,
      buttons,
      defaultStyle,
      isCard
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
            src={require('../../images/bg_wave.png')}
          ></Image>
        </View>
        {/*  <view class="padding bg-white" style=" background: linear-gradient(to bottom, #ffffff,25%, #f1f1f1);">
                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                              </view>  */}
        <View className="padding">
          <View className="radius shadow shadow-lg bg-white margin-top flex">
            <View className="cu-list menu">
              <View className="cu-item">
                <View className="content">
                  <Text className="cuIcon-favorfill text-yellow"></Text>
                  <Text className="text-black text-lg">当前可用积分：</Text>
                  <Text className="text-green text-xxl">{score}</Text>
                </View>
              </View>
            </View>
          </View>
          {/*   */}
          <View
            className="justify-center"
            style="display: flex;padding-top: 100rpx;"
          >
            <View
              className={'cu-modal ' + (modalName == 'begin' ? 'show' : '')}
            >
              <View className="cu-dialog">
                <View className="cu-bar bg-white justify-end">
                  <View className="content">积分抽奖提示</View>
                  <View className="action" onClick={this.cancel}>
                    <Text className="cuIcon-close text-red"></Text>
                  </View>
                </View>
                <View className="padding-xl">
                  是否要消耗10积分进行一次抽奖测试？
                </View>
                <View className="cu-bar bg-white justify-end">
                  <View className="action">
                    <Button
                      className="cu-btn line-green text-green"
                      onClick={this.cancel}
                    >
                      取消
                    </Button>
                    <Button
                      className="cu-btn bg-green margin-left"
                      onClick={this.start}
                    >
                      确定
                    </Button>
                  </View>
                </View>
              </View>
            </View>
            <View
              className={'cu-modal ' + (modalName == 'score' ? 'show' : '')}
            >
              <View className="cu-dialog">
                <View className="cu-bar bg-white justify-end">
                  <View className="content">积分不足提示</View>
                  <View className="action" onClick={this.cancel}>
                    <Text className="cuIcon-close text-red"></Text>
                  </View>
                </View>
                <View className="padding-xl">抱歉，您的积分不足。</View>
                <View className="cu-bar bg-white justify-end">
                  <View className="action">
                    <Button
                      className="cu-btn bg-green margin-left"
                      onClick={this.cancel}
                    >
                      确定
                    </Button>
                  </View>
                </View>
              </View>
            </View>
            <View className={'cu-modal ' + (modalName == 'info' ? 'show' : '')}>
              <View className="cu-dialog">
                <View className="cu-bar bg-white justify-end">
                  <View className="content">信息缺失提示</View>
                  <View className="action" onClick={this.cancel}>
                    <Text className="cuIcon-close text-red"></Text>
                  </View>
                </View>
                <View className="padding-xl">
                  抱歉，您的个人信息不全，我们将无法在您获得奖品后顺利为您寄送
                </View>
                <View className="cu-bar bg-white justify-end">
                  <View className="action">
                    <Button
                      className="cu-btn line-green text-green"
                      onClick={this.cancel}
                    >
                      取消
                    </Button>
                    <Button
                      className="cu-btn bg-green margin-left"
                      onClick={this.to_modify}
                    >
                      前往补全
                    </Button>
                  </View>
                </View>
              </View>
            </View>
            <View className={'cu-modal ' + (modalName == 'end' ? 'show' : '')}>
              <View className="cu-dialog">
                <View className="cu-bar bg-white justify-end">
                  <View className="content">您的抽奖结果:</View>
                  <View className="action" onClick={this.cancel}>
                    <Text className="cuIcon-close text-red"></Text>
                  </View>
                </View>
                <View className="padding-xl">{prize_desc}</View>
                <View className="cu-bar bg-white justify-end">
                  <View className="action">
                    <Button
                      className="cu-btn bg-green margin-left"
                      onClick={this.cancel}
                    >
                      确定
                    </Button>
                  </View>
                </View>
              </View>
            </View>
            <LuckyGrid
              id="myLucky"
              width="600rpx"
              height="600rpx"
              blocks={blocks}
              prizes={prizes}
              buttons={buttons}
              defaultStyle={defaultStyle}
              onStart={this.check_start}
              onEnd={this.end}
            ></LuckyGrid>
          </View>
        </View>
        <View className={'cu-card article ' + (isCard ? 'no-card' : '')}>
          <View className="cu-item shadow">
            <View className="title">
              <View className="text-cut">抽奖说明</View>
            </View>
            <View className="content">
              <View className="desc">
                <View className="text-content">测试阶段抽奖每次扣除10积分</View>
                <View></View>
              </View>
            </View>
          </View>
        </View>
      </Block>
    )
  }
}

export default _C
