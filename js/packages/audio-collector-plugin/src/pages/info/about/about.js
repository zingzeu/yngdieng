import { Block, View, Text } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './about.scss'

@withWeapp({
  /**
   * 页面的初始数据
   */
  data: {},
  reback() {
    console.log('tap')
    Taro.navigateBack({})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})
class _C extends React.Component {
  render() {
    return (
      <Block>
        <View className="cu-bar bg-blue" s></View>
        <View className="cu-bar bg-blue" s>
          <View className="action" onClick={this.reback}>
            <Text className="cuIcon-close"></Text>关闭
          </View>
          <View className="content text-bold">关于</View>
        </View>
        <View className="margin-xl bg-white padding-xl radius shadow-lg">
          <View className="text-center margin-bottom text-lg  text-grey">
            关于榕声众包
          </View>
          <View className="text-content">
            <View>Hi！志愿者~欢迎参加榕声众包项目！</View>
            <View className="margin-top-sm">
              榕声众包是真鸟囝团队榕声音档项目组与福州话语音识别SIT项目小组共同推进开发的一款福州话音频语料收集平台。
            </View>
            <View className="margin-top-sm">
              您的录音将帮助我们构建福州话的语音模型，主要用于福州话语音转榕拼，语音转文本等功能的开发。录音也有可能作为示例发音收录至榕典发音库等其他真鸟囝项目中。
            </View>
            <View className="margin-top-sm">
              您的录音将会帮助真鸟囝保育福州话的工作。我们承诺为志愿者贡献的隐私信息做好保密工作，同时保证不会将收集到的数据用在任何以盈利为目的的商业场景中。
            </View>
            <View className="margin-top-sm"></View>
          </View>
        </View>
      </Block>
    )
  }
} // pages/info/about/about.js

export default _C
