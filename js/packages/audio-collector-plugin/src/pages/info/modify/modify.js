import {
  Block,
  View,
  Text,
  Form,
  Button,
  Input,
  PickerView,
  PickerViewColumn,
  Picker
} from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import LuckyGrid from '../../../miniprogram_npm/@lucky-canvas/mini/lucky-grid/index'
import LuckyWheel from '../../../miniprogram_npm/@lucky-canvas/mini/lucky-wheel/index'
import PopUp from '../../../components/pop-up/index'
import './modify.scss'
const app = Taro.getApp()
var address = require('./city.js')

@withWeapp({
  reback() {
    console.log('tap')
    Taro.navigateBack({})
  },
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    index: null,
    ad_region: '',
    address: '', //详细收货地址（四级）
    value: [0, 0, 0], // 地址选择器省市区 暂存 currentIndex
    region: '', //所在地区
    regionValue: [0, 0, 0], // 地址选择器省市区 最终 currentIndex
    provinces: [], // 一级地址
    citys: [], // 二级地址
    areas: [], // 三级地址
    visible: false,
    isCanConfirm: true, //是否禁止在第一列滚动期间点击确定提交数据
    avatar: '',
    telephone: '',
    name: ''
  },
  RegionChange: function(e) {
    this.setData({
      ad_region:
        e.detail.value[0] + '，' + e.detail.value[1] + '，' + e.detail.value[2]
    })
  },
  ChooseImage() {
    Taro.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: res => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    })
  },
  ViewImage(e) {
    Taro.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    })
  },
  DelImg(e) {
    Taro.showModal({
      title: '召唤师',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1)
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  textareaBInput(e) {
    this.setData({
      textareaBValue: e.detail.value
    })
  },
  onLoad(options) {
    // 默认联动显示北京
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces, // 34省
      citys: address.citys[id], //默认北京市辖区
      areas: address.areas[address.citys[id][0].id],
      ad_region: app.globalData.ad_region,
      address: app.globalData.address, //详细收货地址（四级）
      region: app.globalData.region,
      avatar: app.globalData.avatar,
      telephone: app.globalData.telephone,
      name: app.globalData.name
    })
  },
  closePopUp() {
    this.setData({
      visible: false
    })
  },
  pickAddress() {
    this.setData({
      visible: true,
      value: [...this.data.regionValue]
    })
  },
  cityChange(e) {
    var value = e.detail.value
    let { provinces, citys } = this.data
    var provinceNum = value[0]
    var cityNum = value[1]
    var areaNum = value[2]

    if (this.data.value[0] !== provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id]
      })
    } else if (this.data.value[1] !== cityNum) {
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id]
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum, areaNum]
      })
    }
  },
  preventTouchmove() {},
  // 点击地区选择取消按钮
  cityCancel(e) {
    var id = address.provinces[0].id
    this.setData({
      citys: this.data.lastCitys || address.citys[id], //默认北京市辖区,
      areas: this.data.lastAreas || address.areas[address.citys[id][0].id],
      value: [...this.data.regionValue],
      visible: false
    })
  },
  // 提交时由序号获取省市区id
  getRegionId(type) {
    let value = this.data.regionValue
    let provinceId = address.provinces[value[0]].id
    let townId = address.citys[provinceId][value[1]].id
    let areaId = ''
    if (address.areas[townId][value[2]].id) {
      areaId = address.areas[townId][value[2]].id
    } else {
      areaId = 0
    }

    if (type === 'provinceId') {
      return provinceId
    } else if (type === 'townId') {
      return townId
    } else {
      return areaId
    }
  },
  chooseStart(e) {
    this.setData({
      isCanConfirm: false
    })
  },
  chooseEnd(e) {
    this.setData({
      isCanConfirm: true
    })
  },
  // 点击地区选择确定按钮
  citySure(e) {
    if (this.data.isCanConfirm) {
      var value = this.data.value
      this.setData({
        visible: false
      })
      // 将选择的城市信息显示到输入框
      try {
        var region =
          (this.data.provinces[value[0]].name || '') +
          '，' +
          (this.data.citys[value[1]].name || '')
        if (this.data.areas.length > 0) {
          region = region + '，' + this.data.areas[value[2]].name || ''
        } else {
          this.data.value[2] = 0
        }
      } catch (error) {
        console.log('adress select something error')
      }

      this.setData(
        {
          region: region,
          lastCitys: this.data.citys,
          lastAreas: this.data.areas,
          regionValue: [...this.data.value]
        },
        () => {
          console.log(
            `省份ID：${this.getRegionId(
              'provinceId'
            )}: 市区ID：${this.getRegionId(
              'townId'
            )}：城区ID：${this.getRegionId('areas')}`
          )
        }
      )
    }
  },
  get_avatar() {
    var that = this
    Taro.showToast({
      title: '获取中',
      icon: 'loading',
      duration: 5000
    })
    Taro.getUserProfile({
      desc: '用于完善信息资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: res => {
        let user = res.userInfo
        console.log('内部的this', user)
        Taro.request({
          url: user.avatarUrl,
          method: 'GET',
          responseType: 'arraybuffer',
          success: function(res) {
            that.setData({
              name: user.nickName
            })
            let base64 = Taro.arrayBufferToBase64(res.data)
            // console.log(base64)
            that.setData({
              avatar: base64
            })
          }
        })
        that.setData({
          name: this.data.name,
          avatar: this.data.avatar
        })
        Taro.showToast({
          title: '获取成功',
          icon: 'success',
          duration: 500
        })
        console.log(this.data.avatar)
      }
    })
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
      url: 'https://one.siuze.top/UpdateUserInfo', //自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      data: {
        WXid: app.globalData.WXid,
        region: that.data.region,
        name: e.detail.value.name,
        address: that.data.ad_region + '，' + e.detail.value.address,
        telephone: e.detail.value.telephone,
        avatar: that.data.avatar
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.session_state == 1) {
          app.globalData.region = that.data.region
          ;(app.globalData.name = e.detail.value.name),
            (app.globalData.ad_region = that.data.ad_region),
            (app.globalData.address = e.detail.value.address),
            (app.globalData.telephone = e.detail.value.telephone),
            (app.globalData.avatar = that.data.avatar)
          app.globalData.clock = -app.globalData.clock
          Taro.showToast({
            title: '更新成功',
            icon: 'success',
            duration: 2000
          })
          console.log(app.globalData.name)
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
    const {
      avatar,
      name,
      region,
      visible,
      value,
      provinces,
      citys,
      areas,
      customItem,
      ad_region,
      address,
      telephone
    } = this.data
    return (
      <Block>
        <View className="cu-bar bg-blue" s></View>
        <View className="cu-bar bg-blue" s>
          <View className="action" onClick={this.reback}>
            <Text className="cuIcon-close"></Text>返回
          </View>
          <View className="content text-bold">用户信息修改</View>
        </View>
        <Form onSubmit={this.formSubmit}>
          <View
            className="cu-form-group margin-top"
            style="justify-content: flex-end;"
          >
            <View className="title" style="margin-right: auto;">
              当前头像
            </View>
            {/*  <text>点击获取微信头像</text>  */}
            <Button
              className="cu-btn round line-green"
              onClick={this.get_avatar}
            >
              获取微信头像与昵称
            </Button>
            <View
              className="cu-avatar radius bg-gray"
              style={
                'margin-left: 20rpx; background-image:url(data:image/png;base64,' +
                avatar +
                ');'
              }
            ></View>
          </View>
          <View className="cu-form-group">
            <View className="title">用户名称</View>
            <Input
              placeholder="将作为发音人和礼品收件人名称"
              value={name}
              style="text-align: right;"
              name="name"
            ></Input>
          </View>
          <View
            className="cu-form-group"
            style="justify-content: flex-end;"
            onClick={this.pickAddress}
          >
            <View className="title" style="margin-right: auto;">
              口音归属
            </View>
            <View className="justify-end">{region || '请选择'}</View>
            <Text
              className="cuIcon-right text-grey"
              style="text-align: right;"
            ></Text>
            <PopUp
              visible={visible}
              onClose={this.closePopUp}
              renderContent={
                <Block>
                  <View>
                    <View className="picker-view">
                      <View className="picker-view__pane">
                        <Text
                          onClick={this.privateStopNoop.bind(
                            this,
                            this.cityCancel
                          )}
                        >
                          取消
                        </Text>
                        <Text
                          onClick={this.privateStopNoop.bind(
                            this,
                            this.citySure
                          )}
                        >
                          确定
                        </Text>
                      </View>
                      <PickerView
                        className="pick-view__group"
                        onChange={this.cityChange}
                        onPickstart={this.chooseStart}
                        onPickend={this.chooseEnd}
                        value={value}
                      >
                        <PickerViewColumn indicatorClass="item_active">
                          <Block>
                            {provinces.map((item, index) => {
                              return (
                                <View className="picker-item" key={item.index}>
                                  {item.name}
                                </View>
                              )
                            })}
                          </Block>
                        </PickerViewColumn>
                        <PickerViewColumn>
                          <Block>
                            {citys.map((item, index) => {
                              return (
                                <View className="picker-item" key={item.index}>
                                  {item.name}
                                </View>
                              )
                            })}
                          </Block>
                        </PickerViewColumn>
                        <PickerViewColumn>
                          <Block>
                            {areas.map((item, index) => {
                              return (
                                <View className="picker-item" key={item.index}>
                                  {item.name}
                                </View>
                              )
                            })}
                          </Block>
                        </PickerViewColumn>
                      </PickerView>
                    </View>
                  </View>
                </Block>
              }
            ></PopUp>
          </View>
          <View className="cu-form-group  margin-top">
            <View className="title">收货地址</View>
            <Picker
              mode="region"
              onChange={this.RegionChange}
              customItem={customItem}
            >
              <View className="picker">
                {ad_region == '' ? '请选择' : ad_region}
              </View>
            </Picker>
          </View>
          <View className="cu-form-group">
            <View className="title">详细地址</View>
            <Input
              placeholder="用于礼品邮寄"
              style="text-align: right;"
              name="address"
              value={address}
            ></Input>
          </View>
          <View className="cu-form-group">
            <View className="title">手机号码</View>
            <Input
              placeholder
              style="text-align: right;"
              name="telephone"
              value={telephone}
            ></Input>
          </View>
          <View className="padding-xl">
            <Button
              className="cu-btn block bg-green margin-tb-sm lg shadow"
              formType="submit"
            >
              <Text className="cuIcon-upload"></Text>提交修改
            </Button>
          </View>
        </Form>
      </Block>
    )
  }
}

export default _C
