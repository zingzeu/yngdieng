import {
  Block,
  View,
  Text,
  Form,
  Picker,
  Input,
  ScrollView,
  RadioGroup,
  Radio,
  Textarea,
  Button
} from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import LuckyGrid from '../../miniprogram_npm/@lucky-canvas/mini/lucky-grid/index'
import LuckyWheel from '../../miniprogram_npm/@lucky-canvas/mini/lucky-wheel/index'
import WxsDiyAudioPlayer from '../../components/wxs-diyAudioPlayer/index'
import './back.scss'
const app = Taro.getApp()
var wayIndex = -1
var school_area = ''
var grade = ''
// 当联想词数量较多，使列表高度超过340rpx，那设置style的height属性为340rpx，小于340rpx的不设置height，由联想词列表自身填充
// 结合上面wxml的<scroll-view>
var arrayHeight = 0

@withWeapp({
  data: {
    array: [
      '初审',
      '二审',
      '终审',
      '已通过再复盘',
      '所有正常与疑难且无视正在他人手头审核的标记限制',
      '审疑难',
      '审回收站（故未开发好）'
    ],
    last: ['', '', '', '', '', '', '', '', '', ''],
    order: 0,
    numList: [
      {
        name: '未审'
      },
      {
        name: '一审'
      },
      {
        name: '二审'
      },
      {
        name: '通过'
      },
      {
        name: '疑难'
      }
    ],
    filename: '',
    zid: '',
    rping: '',
    fixed: '',
    flag: 0,
    get_flag: 0,
    note: '',
    auditor: '',
    speaker: '',
    lastAudit: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: Taro.canIUse('button.open-type.getUserInfo'),
    audioSrc: '', // 音频地址，必须是网络地址,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    index: 0,
    num: 1,
    picker: [
      '初审',
      '二审',
      '终审',
      '已通过再复盘',
      '所有正常与疑难且无视正在他人手头审核的标记限制',
      '审疑难',
      '审回收站（故未开发好）'
    ],
    inputValue: '', //点击结果项之后替换到文本框的值
    adapterSource: [
      'weixin',
      'wechat',
      'android',
      'Android',
      'IOS',
      'java',
      'javascript',
      '微信小程序',
      '微信公众号',
      '微信开发者工具'
    ], //本地匹配源
    shengdiao: ['0', '5', '55', '53', '33', '21', '213', '24', '242'],
    yngmu: [
      'a',
      'ai',
      'au',
      'ang',
      'aing',
      'ah',
      'ak',
      'aik',
      'o',
      'oo',
      'ou',
      'ooy',
      'oung',
      'ooung',
      'ooyng',
      'oh',
      'ouk',
      'oouk',
      'ooyk',
      'ooh',
      'e',
      'eo',
      'eoy',
      'eu',
      'ei',
      'eoyng',
      'eing',
      'eoh',
      'eoyk',
      'eh',
      'eik',
      'eih',
      'eoyh',
      'i',
      'ia',
      'ie',
      'iu',
      'ing',
      'iang',
      'ieng',
      'iah',
      'iak',
      'ieh',
      'iek',
      'ih',
      'ik',
      'iau',
      'u',
      'ua',
      'uai',
      'uo',
      'ui',
      'uang',
      'uong',
      'ung',
      'uah',
      'uak',
      'uoh',
      'uok',
      'uh',
      'uk',
      'y',
      'yo',
      'yong',
      'yoh',
      'yok',
      'yk',
      'yh'
    ],
    bindSource: [], //绑定到页面的数据，根据用户输入动态变化
    hideScroll: true,
    focusor: false,
    grammar: true,
    grammar_detail: ''
  },
  PickerChange(e) {
    console.log('审核类别变动')
    console.log(e)
    if (app.globalData.rank < 2 && e.detail.value != 0) {
      e.detail.value = 0
      Taro.showToast({
        title: '权限不足',
        icon: 'error',
        duration: 1000
      })
      return
    }
    this.setData({
      index: e.detail.value
    })
    if (e.detail.value == 0) {
      this.data.get_flag = 0
    } else if (e.detail.value == 1) {
      this.data.get_flag = 1
    } else if (e.detail.value == 2) {
      this.data.get_flag = 2
    } else if (e.detail.value == 3) {
      this.data.get_flag = 10
    } else if (e.detail.value == 4) {
      this.data.get_flag = 100
    } else if (e.detail.value == 5) {
      this.data.get_flag = 11
    } else if (e.detail.value == 6) {
      this.data.get_flag = 12
    }
    this.next(0)
  },

  reback() {
    console.log('tap')
    Taro.navigateBack({})
  },
  cleantag(filename) {
    console.log(this.data.filename)
    Taro.request({
      url: 'https://one.siuze.top/CleanFlag', //自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      data: { WXid: app.globalData.WXid, filename: filename },

      success: function(res) {
        console.log(res.data)
      },
      fail: function() {
        console.log('失败')
      }
    })
  },
  next_n() {
    this.next(2)
  },
  next(e) {
    var old_filename = this.data.filename

    this.data.last[9] = this.data.last[8]
    this.data.last[8] = this.data.last[7]
    this.data.last[7] = this.data.last[6]
    this.data.last[6] = this.data.last[5]
    this.data.last[5] = this.data.last[4]
    this.data.last[4] = this.data.last[3]
    this.data.last[3] = this.data.last[2]
    this.data.last[2] = this.data.last[1]
    this.data.last[1] = this.data.last[0]
    this.data.last[0] = this.data.filename
    console.log(this.data.last)

    var that = this
    console.log(that.data.get_flag)
    // console.log(that.data.message)
    Taro.request({
      url: 'https://one.siuze.top/GetAudio', //自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      data: {
        WXid: app.globalData.WXid,
        filename: old_filename,
        order: e,
        flag: that.data.get_flag,
        tag: 1
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.session_state == 2) {
          Taro.showToast({
            title: '没有更多了',
            icon: 'error',
            duration: 1500
          })
          return
        }
        if (res.data.session_state != 1) {
          Taro.showToast({
            title: '加载出错',
            icon: 'error',
            duration: 1500
          })
          return
        }
        that.setData({
          filename: res.data.filename,
          zid: res.data.zid,
          rping: res.data.rping,
          flag: res.data.flag,
          fixed: res.data.fixed,
          note: res.data.note,
          auditor: res.data.auditor,
          speaker: res.data.speaker,
          lastAudit: res.data.lastAudit,
          audioSrc:
            'https://one.siuze.top/downloadAudio/' + res.data.filename + '.mp3'
        })
        if (res.data.flag == 0) that.setData({ num: 0 })
        else if (res.data.flag == 1) that.setData({ num: 1 })
        else if (res.data.flag == 2) that.setData({ num: 2 })
        else if (res.data.flag == 10) that.setData({ num: 3 })
        else that.setData({ num: 4 })
      },
      fail: function() {
        console.log('失败')
      }
    })
    this.cleantag(old_filename)
  },
  last() {
    this.cleantag(this.data.filename)
    this.data.filename = this.data.last[0]
    this.data.last[0] = this.data.last[1]
    this.data.last[1] = this.data.last[2]
    this.data.last[2] = this.data.last[3]
    this.data.last[3] = this.data.last[4]
    this.data.last[4] = this.data.last[5]
    this.data.last[5] = this.data.last[6]
    this.data.last[6] = this.data.last[7]
    this.data.last[7] = this.data.last[8]
    this.data.last[8] = this.data.last[9]
    this.data.last[9] = ''
    if (this.data.filename == '') {
      Taro.showToast({
        title: '已经到顶了',
        icon: 'error',
        duration: 1000
      })
      return
    }
    var that = this
    // console.log(that.data.message)
    Taro.request({
      url: 'https://one.siuze.top/GetAudio', //自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      data: {
        WXid: app.globalData.WXid,
        filename: that.data.filename,
        order: 4,
        flag: 100,
        tag: 1
      },
      success: function(res) {
        console.log(res.data)
        that.setData({
          filename: res.data.filename,
          zid: res.data.zid,
          rping: res.data.rping,
          flag: res.data.flag,
          fixed: res.data.fixed,
          note: res.data.note,
          auditor: res.data.auditor,
          speaker: res.data.speaker,
          lastAudit: res.data.lastAudit,
          audioSrc:
            'https://one.siuze.top/downloadAudio/' + res.data.filename + '.mp3'
        })
        if (res.data.flag == 0) that.setData({ num: 0 })
        else if (res.data.flag == 1) that.setData({ num: 1 })
        else if (res.data.flag == 2) that.setData({ num: 2 })
        else if (res.data.flag == 10) that.setData({ num: 3 })
        else that.setData({ num: 4 })
      },
      fail: function() {
        console.log('失败')
      }
    })
    // this.compData.getAudioInfo();
    // this.selectComponent('#myComponent').init({
    //   ...this.data.data
    // })
  },
  onLoad: function(options) {
    var that = this
    // this.compData=selectComponent("#myComponent");
    Taro.request({
      url: 'https://one.siuze.top/GetAudio', //自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      data: {
        WXid: app.globalData.WXid,
        filename: '',
        order: 0,
        flag: 0,
        tag: 1
      },
      success: function(res) {
        var au = ''
        if (res.data.auditor != null) {
          au = res.data.auditor
        }
        console.log(res.data)
        that.setData({
          filename: res.data.filename,
          zid: res.data.zid,
          rping: res.data.rping,
          flag: res.data.flag,
          fixed: res.data.fixed,
          note: res.data.note,
          auditor: au,
          speaker: res.data.speaker,
          lastAudit: res.data.lastAudit,
          audioSrc:
            'https://one.siuze.top/downloadAudio/' + res.data.filename + '.mp3'
        })
        if (res.data.flag == 0) that.setData({ num: 0 })
        else if (res.data.flag == 1) that.setData({ num: 1 })
        else if (res.data.flag == 2) that.setData({ num: 2 })
        else if (res.data.flag == 10) that.setData({ num: 3 })
        else that.setData({ num: 4 })
      },
      fail: function() {
        console.log('失败')
      }
    })
  },
  formSubmit: function(e) {
    var that = this
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (e.detail.value.sendflag == 0) {
      if (this.data.get_flag == 0) {
        e.detail.value.sendflag = 1
      } else if (this.data.get_flag == 1) {
        e.detail.value.sendflag = 2
      } else {
        e.detail.value.sendflag = 10
      }
    }
    Taro.request({
      url: 'https://one.siuze.top/UpdateAudio', //自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      data: {
        WXid: app.globalData.WXid,
        filename: that.data.filename,
        fixed: e.detail.value.fixed,
        note: e.detail.value.note,
        flag: e.detail.value.sendflag
      },
      success: function(res) {
        console.log(res.data)
        Taro.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 1000
        })
        if (e.detail.value.sendflag == 0) that.setData({ num: 0 })
        else if (e.detail.value.sendflag == 1) that.setData({ num: 1 })
        else if (e.detail.value.sendflag == 2) that.setData({ num: 2 })
        else if (e.detail.value.sendflag == 10) that.setData({ num: 3 })
        else that.setData({ num: 4 })
      },
      fail: function() {
        console.log('失败')
        Taro.showToast({
          title: '提交失败',
          icon: 'error',
          duration: 1000
        })
      }
    })
  },

  clean() {
    this.cleantag('')
  },
  //当键盘输入时，触发input事件
  bindinput: function(e) {
    //用户实时输入值
    var prefix = e.detail.value
    //匹配的结果
    var newSource = []
    if (prefix != '') {
      var testnum = /^((([a-z]+[0-5]+)\s)*)([a-z]+)([0-5]*)$/.exec(prefix)
      //[0]整个字符串，1去掉最后一个音节(末尾有空格)，2最后一个音节（末尾有空格），3最后一个音节（末尾无空格），4最后一个音节的英文，5最后一个音节的数字
      if (testnum != null) {
        console.log(testnum)
        if (testnum[5] != '') {
          //有数字的情况
          this.data.shengdiao.forEach(function(e) {
            // 用户输入的字符串如果在数组中某个元素中出现，将该元素存到newSource中
            if (e.startsWith(testnum[5]) == true) {
              newSource.push(testnum[1] + testnum[4] + e)
            }
          })
        } else {
          var s = testnum[4].replace('ng', 'x')
          s = s.replace('nj', 'q')
          var sy = /^(b|p|m|d|t|n|l|s|z|c|g|k|x|h|w|l|j|q)?([aoeiuy][a-z]*)?$/.exec(
            s
          )
          //0声韵，1声母,2韵母
          if (sy != null) {
            // if (sy[])
            console.log('声韵检查：')
            console.log(sy)
            if (sy[2] == null) {
              //没有韵母
              if (sy[1] == 'n') {
                newSource.push(testnum[0])
                newSource.push(testnum[0] + 'j')
                newSource.push(testnum[0] + 'g')
              } else {
                newSource.push(testnum[0])
              }
            } else {
              var yuanyunmu = sy[2].replace('x', 'ng')
              this.data.yngmu.forEach(function(e) {
                // 用户输入的字符串如果在数组中某个元素中出现，将该元素存到newSource中
                if (e.startsWith(yuanyunmu) == true) {
                  // console.log(e);
                  var shengmu = ''
                  if (sy[1] != null) {
                    shengmu = sy[1].replace('x', 'ng').replace('q', 'nj')
                  }
                  // if (e==yuanyunmu){
                  //   newSource.push(testnum[1]+shengmu+e+"55")
                  //   newSource.push(testnum[1]+shengmu+e+"53")
                  //   newSource.push(testnum[1]+shengmu+e+"33")
                  //   newSource.push(testnum[1]+shengmu+e+"242")
                  //   newSource.push(testnum[1]+shengmu+e+"24")
                  //   newSource.push(testnum[1]+shengmu+e+"213")
                  //   newSource.push(testnum[1]+shengmu+e+"5")
                  //   newSource.push(testnum[1]+shengmu+e+"55")
                  //   newSource.push(testnum[1]+shengmu+e+"55")
                  // }
                  // else{newSource.push(testnum[1]+shengmu+e)}
                  newSource.push(testnum[1] + shengmu + e)
                }
              })
            }
          }
        }
      }
      // 对于数组array进行遍历，功能函数中的参数 `e`就是遍历时的数组元素值。
      // this.data.adapterSource.forEach(function (e) {
      //   // 用户输入的字符串如果在数组中某个元素中出现，将该元素存到newSource中
      //   if (e.startsWith(prefix) ==true) {
      //     console.log(e);
      //     newSource.push(e)
      //   }
      // })
    }
    // 如果匹配结果存在，那么将其返回，相反则返回空数组
    if (newSource.length != 0) {
      console.log(newSource)
      this.setData({
        // 匹配结果存在，显示自动联想词下拉列表
        hideScroll: false,
        bindSource: newSource,
        arrayHeight: newSource.length * 71,
        fixed: e.detail.value
      })
    } else {
      this.setData({
        // 匹配无结果，不现实下拉列表
        hideScroll: true,
        fixed: e.detail.value,
        bindSource: []
      })
    }
  },

  // 用户点击选择某个联想字符串时，获取该联想词，并清空提醒联想词数组
  itemtap: function(e) {
    this.setData({
      // .id在wxml中被赋值为{{item}}，即当前遍历的元素值
      // inputValue: e.target.id,
      fixed: e.target.id,
      // focusor:true
      // 当用户选择某个联想词，隐藏下拉列表
      hideScroll: true,
      bindSource: []
    })
  },
  check_grammar() {
    var that = this
    var f = this.data.fixed.replace('ng', 'x').replace('nj', 'q')
    var str = /^([abcdeghijklmnopqstuwxyz012345]+)(\s[abcdeghijklmnopqstuwxyz123450]+)*$/.exec(
      f
    )
    console.log('str:')
    console.log(str)
    if (str == null) {
      var res = new Array(false, '存在不合语法的字符')
      return res
      // this.setData({
      //   grammar:false,
      //   grammar_detail:"存在不合语法的字符"
      // })
      // return
    } else {
      var i = 0
      var ym_g = false
      // str.forEach(function (e) {
      for (let d = 0; d < str.length; ++d) {
        var e = str[d]
        // for (const e of str) {
        if (i == 0) {
          i++
        } else {
          if (e == null) {
            continue
          }
          console.log('正在检查的音节：')
          console.log(e)
          e = e.replace(' ', '')
          var ln = /^([a-z]*)([0-5]*)$/.exec(e)
          console.log('次序')
          console.log(i)
          console.log(ln)
          if (ln == null) {
            var res = new Array(
              false,
              '第' +
                i.toString() +
                '个音节不满足【声韵（英文）+声调（数字）】的组合'
            )
            return res
            // that.setData({
            //   grammar:false,
            //   grammar_detail:"第"+i.toString()  +"个音节不满足【声韵（英文）+声调（数字）】的组合"
            // })
            // return
          } else {
            if (ln[1] == null) {
              var res = new Array(false, '第' + i.toString() + '个音节缺少声韵')
              return res
              // that.setData({
              //   grammar:false,
              //   grammar_detail:"第"+i.toString()  +"个音节缺少声韵"
              // })
              // return
            } else if (ln[2] == null) {
              var res = new Array(false, '第' + i.toString() + '个音节缺少声调')
              return res
              that.setData({
                grammar: false,
                grammar_detail: ' 第' + i.toString() + '个音节缺少声调'
              })
              return
            } else if (
              ln[2] != '0' &&
              ln[2] != '5' &&
              ln[2] != '55' &&
              ln[2] != '53' &&
              ln[2] != '33' &&
              ln[2] != '213' &&
              ln[2] != '24' &&
              ln[2] != '242' &&
              ln[2] != '21'
            ) {
              console.log('此处不合法')
              var res = new Array(
                false,
                '第' + i.toString() + '个音节的声调不合法'
              )
              return res
              that.setData({
                grammar: false,
                grammar_detail: ' 第' + i.toString() + '个音节的声调不合法'
              })
              return
            } else if (ln[1] == 'ng') {
              var res = new Array(true, 'OK')
              return res
              that.setData({
                grammar: true,
                grammar_detail: ''
              })
              return
            }
            var sy = /^(b|p|m|d|t|n|l|s|z|c|g|k|x|h|w|l|j|q)?([aoeiuy][a-z]*)$/.exec(
              ln[1]
            )
            console.log('检查当前音节声韵：')
            console.log(sy)
            if (sy == null) {
              var res = new Array(
                false,
                '第' + i.toString() + '个音节的(零)声母+韵母的组合不合法'
              )
              return res
              that.setData({
                grammar: false,
                grammar_detail:
                  '第' + i.toString() + '个音节的(零)声母+韵母的组合不合法'
              })
              return
            }
            ym_g = false
            for (let d = 0; d < that.data.yngmu.length; ++d) {
              var e = that.data.yngmu[d].replace('ng', 'x')
              // for (const e of that.data.yngmu) {
              // that.data.yngmu.forEach(function (e) {
              if (e == sy[2]) {
                ym_g = true
              }
              //  })
            }
            if (ym_g == false) {
              var res = new Array(
                false,
                '第' + i.toString() + '个音节的韵母不合法'
              )
              return res
              that.setData({
                grammar: false,
                grammar_detail: ' 第' + i.toString() + '个音节的韵母不合法'
              })
              return
            } else {
              // var res=new Array(true,"OK");
              // return res;
              // that.setData({
              // grammar:true,
              // grammar_detail:""
              // })
            }
          }
          i++
        }
        // })
      }
    }
    that.setData({
      grammar: true,
      grammar_detail: 'OK'
    })
    var res = new Array(true, 'OK')
    return res
  },
  closescroll() {
    console.log('失去焦点')
    this.setData({
      // 匹配无结果，不现实下拉列表
      hideScroll: true
    })
    var res = this.check_grammar()
    this.setData({
      grammar: res[0],
      grammar_detail: res[1]
    })
    if (res[0] == false) {
      this.setData({
        hideScroll: res[0],
        bindSource: [res[1]]
      })
    }
    console.log(res)
  }
})
class _C extends React.Component {
  render() {
    const {
      index,
      picker,
      filename,
      rping,
      audioSrc,
      grammar,
      fixed,
      hideScroll,
      arrayHeight,
      bindSource,
      modalName,
      note,
      auditor,
      speaker,
      num,
      numList
    } = this.data
    return (
      <Block>
        <View className="cu-bar bg-blue" s></View>
        <View className="cu-bar bg-blue" s>
          <View className="action" onClick={this.reback}>
            <Text className="cuIcon-close"></Text>关闭
          </View>
          <View className="content text-bold">后台审核</View>
        </View>
        <Form onSubmit={this.formSubmit} onReset={this.formReset}>
          <View className="cu-form-group">
            <Text decode={true}>&nbsp;</Text>
            <Text className="cuIcon-list text-grey"></Text>
            <Text className="title" decode={true}>
              &nbsp;&nbsp;审核类别
            </Text>
            <Picker onChange={this.PickerChange} value={index} range={picker}>
              <View className="picker">{index ? picker[index] : '初审'}</View>
            </Picker>
          </View>
          <View className="cu-list menu">
            <View className="cu-form-group" style="background: #fbf9fe;">
              <Text className="cuIcon-form text-grey"></Text>
              <Text decode={true}>&nbsp;</Text>
              <View className="title">音频文件名</View>
              <Input
                placeholder={filename}
                style="text-align: right;font-size: inherit;"
                readonly="readonly"
              ></Input>
            </View>
            <View className="cu-form-group" style="background: #fbf9fe;">
              <Text className="cuIcon-focus text-grey"></Text>
              <Text decode={true}>&nbsp;</Text>
              <View className="title">理论记音</View>
              <Input
                placeholder={rping}
                style="text-align: right;"
                readonly="readonly"
              ></Input>
            </View>
          </View>
          <View className>
            <WxsDiyaudioplayer
              audioSrc={audioSrc}
              id="myComponent"
            ></WxsDiyaudioplayer>
          </View>
          <View className="cu-form-group margin-top">
            <Text className="cuIcon-write text-grey"></Text>
            <Text decode={true}>&nbsp;</Text>
            <View className="title">校对后记音</View>
            <Input
              name="fixed"
              onBlur={this.closescroll}
              onFocus={this.bindinput}
              onInput={this.bindinput}
              style={
                'text-align: right;' + (grammar == true ? '' : 'color:red;')
              }
              value={fixed}
            ></Input>
          </View>
          <View
            className="cu-form-group"
            style="text-align: right;min-height: 0rpx;"
          >
            {!hideScroll && (
              <ScrollView
                scrollY="true"
                className="scrollview"
                style={arrayHeight > 340 ? 'height:340rpx' : ''}
              >
                {bindSource.map((item, index) => {
                  return (
                    <View>
                      <View
                        id={item}
                        onClick={this.itemtap}
                        className="itemview text-lg text-gray"
                        style="padding: 15rpx;"
                      >
                        {item}
                      </View>
                    </View>
                  )
                })}
              </ScrollView>
            )}
          </View>
          <RadioGroup className="block" name="sendflag">
            <View className="cu-form-group">
              <View className="title">
                <Text className="cuIcon-repair text-grey"></Text>
                <Text decode={true}>&nbsp;</Text>处理
              </View>
              <View>
                <Text>正常</Text>
                <Radio checked className="margin-left-sm" value="0"></Radio>
              </View>
              <View>
                <Text>疑难</Text>
                <Radio className="blue radio margin-left-sm" value="11"></Radio>
              </View>
              <View>
                <Text>删除</Text>
                <Radio className="red margin-left-sm" value="12"></Radio>
              </View>
            </View>
          </RadioGroup>
          <View className="cu-form-group align-start">
            <View className="title">
              <Text className="cuIcon-tag text-grey"></Text>
              <Text decode={true}>&nbsp;</Text>备注
            </View>
            <Textarea
              maxlength="-1"
              disabled={modalName != null}
              onInput={this.textareaBInput}
              placeholder="当前无备注"
              value={note}
              name="note"
            ></Textarea>
          </View>
          <View className="margin-top"></View>
          <View className="padding-xl">
            <Button
              className="cu-btn block bg-green margin-tb-sm lg shadow"
              formType="submit"
            >
              <Text className="cuIcon-upload"></Text>提交
            </Button>
            <Button
              className="cu-btn block bg-gray margin-tb-sm lg shadow"
              onClick={this.last}
              style="margin-top: 40rpx;"
            >
              <Text className="cuIcon-back"></Text>上一条
            </Button>
            <Button
              className="cu-btn block bg-blue margin-tb-sm lg shadow"
              onClick={this.next_n}
              style="margin-top: 40rpx;"
            >
              <Text className="cuIcon-right"></Text>下一条
            </Button>
          </View>
        </Form>
        <View className="cu-list menu margin-top">
          <View className="cu-item" style="background: #fbf9fe;">
            <View className="content">
              <Text className="cuIcon-profile text-grey"></Text>
              <Text className="title">历史审核人</Text>
              <Text
                className="text-grey"
                style="text-align:right;padding-left:100rpx;"
              >
                {auditor}
              </Text>
            </View>
          </View>
          <View className="cu-item" style="background: #fbf9fe;">
            <View className="content">
              <Text className="cuIcon-voice text-grey"></Text>
              <Text className="title">音频贡献者</Text>
              <Text
                className="text-grey"
                style="text-align:right;padding-left:100rpx;"
              >
                {speaker}
              </Text>
            </View>
          </View>
          <View className="cu-item" style="background: #fbf9fe;">
            <View className="content">
              <Text className="cuIcon-squarecheck text-grey"></Text>
              <Text className="title">当前待处理音频已完成状态</Text>
            </View>
          </View>
          <View className="bg-white padding">
            <View className="cu-steps">
              {numList.map((item, index) => {
                return (
                  <View
                    className={'cu-item ' + (index > num ? '' : 'text-blue')}
                    key
                  >
                    <Text
                      className={'num ' + (index == 4 ? 'err' : '')}
                      data-index={index + 1}
                    ></Text>
                    {item.name}
                  </View>
                )
              })}
            </View>
          </View>
        </View>
      </Block>
    )
  }
}

export default _C
