import {
  Block,
  View,
  Text,
  Form,
  Textarea,
  Input,
  Button
} from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './feedback.scss'
const app = Taro.getApp()

@withWeapp({
  reback() {
    console.log('tap')
    Taro.navigateBack({})
  },
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    index: null
  },
  formSubmit: function(e) {
    var that = this
    Taro.showToast({
      title: '提交中',
      icon: 'loading',
      duration: 8000
    })
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    Taro.request({
      url: 'https://one.siuze.top/feedback', //自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      data: {
        WXid: app.globalData.WXid,
        text: e.detail.value.text,
        email: e.detail.value.email
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.session_state == 1) {
          Taro.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          Taro.showToast({
            title: '提交失败',
            icon: 'error',
            duration: 2000
          })
        }
      },
      fail: function() {
        console.log('失败')
        Taro.showToast({
          title: '提交失败',
          icon: 'error',
          duration: 2000
        })
      }
    })
  }
})
class _C extends React.Component {
  render() {
    const { modalName } = this.data
    return (
      <Block>
        <View className="cu-bar bg-blue" s></View>
        <View className="cu-bar bg-blue" s>
          <View className="action" onClick={this.reback}>
            <Text className="cuIcon-close"></Text>返回
          </View>
          <View className="content text-bold">问题反馈</View>
        </View>
        <Form onSubmit={this.formSubmit}>
          <View className="cu-form-group margin-top">
            <Textarea
              maxlength="-1"
              disabled={modalName != null}
              name="text"
              placeholder="请输入需要反馈的问题"
            ></Textarea>
          </View>
          <View className="cu-form-group  margin-top">
            <View className="title">联系邮箱</View>
            <Input
              placeholder
              name="email"
              style="text-align: right;"
              placeholder="请输入您的邮箱"
            ></Input>
          </View>
          {/*  !!!!! placeholder 在ios表现有偏移 建议使用 第一种样式  */}
          <View className="padding-xl">
            <Button
              className="cu-btn block bg-green margin-tb-sm lg shadow"
              formType="submit"
            >
              <Text className="cuIcon-upload"></Text>提交
            </Button>
          </View>
        </Form>
      </Block>
    )
  }
}

export default _C
