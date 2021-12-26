/*
 * @Description: 处理拖拽交互及格式化
 * @Author: yilingsj（315800015@qq.com）
 * @Date: 2020-02-11 15:11:18
 * @LastEditors: yilingsj（315800015@qq.com）
 * @LastEditTime: 2020-05-12 20:30:02
 */
var startX = 0
var left = 0
var lastLeft = 0
var progressWidthValue = 0
var duration = 0
var currentTime = 0
/**
 * @author: yilingsj（315800015@qq.com）
 * @description: 拖拽开始
 * @param {Object} event event
 * @param {Object} ins ins
 * @return {void}
 * @Date: 2020-02-12 15:11:00
 */
function touchStart(event, ins) {
  var touch = event.touches[0] || event.changedTouches[0]
  startX = touch.pageX
  ins.callMethod('touchStart')
}
/**
 * @author: yilingsj（315800015@qq.com）
 * @description: 拖拽中
 * @param {Object} event event
 * @param {Object} ins ins
 * @return {void}
 * @Date: 2020-02-12 15:11:08
 */
function touchMove(event, ins) {
  var touch = event.touches[0] || event.changedTouches[0]
  var pageX = touch.pageX
  left = pageX - startX + lastLeft
  if (left <= 0) {
    // 滑块运动的最小范围
    left = 0
  }
  if (left > progressWidthValue) {
    // 滑块运动的最大范围
    left = progressWidthValue
  }
  startX = pageX
  lastLeft = left
  currentTime = getcurrentTime() // 计算出音频的播放位置（虽然此处能计算出，但不能直接跟页面通信，所以必须要靠下一行实现响应数据）
  ins.callMethod('touchMove', { currentTime: currentTime }) // 向组件通信
}
/**
 * @author: yilingsj（315800015@qq.com）
 * @description: 停止拖拽
 * @param {Object} event event
 * @param {Object} ins ins
 * @return {void}
 * @Date: 2020-02-12 15:12:56
 */
function touchEnd(event, ins) {
  var touch = event.touches[0] || event.changedTouches[0]
  startX = touch.pageX
  ins.callMethod('touchEnd', { currentTime: currentTime })
}
/**
 * @author: yilingsj（315800015@qq.com）
 * @description: 动态计算
 * @return {void}
 * @Date: 2020-02-12 15:12:35
 */
function getcurrentTime() {
  return (left / progressWidthValue) * duration
}
/**
 * @author: yilingsj（315800015@qq.com）
 * @description: 监听得到音频总长度
 * @param {Object} event event
 * @param {Object} ins ins
 * @return {void}
 * @Date: 2020-02-12 10:10:07
 */
function propDuration(newValue) {
  if (newValue) {
    duration = newValue
  }
}
/**
 * @author: yilingsj（315800015@qq.com）
 * @description: 获取进度条有限宽度
 * @param {Number} newValue number
 * @returnn {void}
 * @Date: 2020-02-12 10:17:07
 */
function propProgressWidth(newValue) {
  if (newValue) {
    progressWidthValue = newValue
  }
}
/**
 * @author: yilingsj（315800015@qq.com）
 * @description: 根据播放进度动态计算left
 * @param {Number} currentTime 当前播放位置
 * @param {Number} duration 音频长度
 * @param {Number} progressWidthValue 时间轴的有效长度
 * @return {void}
 * @Date: 2020-02-06 19:20:07
 */
function changeX(currentTime, duration, progressWidthValue) {
  return ((currentTime / duration) * progressWidthValue).toFixed(5) || 0
}
/**
 * @author: yilingsj（315800015@qq.com）
 * @description: 时间转换
 * @param {Number} value 数字
 * @param {Boolean} isHours 布尔值
 * @param {Boolean} type 布尔值
 * @return {void}
 * @Date: 2020-02-06 19:20:07
 */
function formatTime(value, isHours, type) {
  var result = null
  var hours = 0
  var minute = 0
  var second = 0
  // 时间转数字
  if (type) {
    var newValue = ('' + value).split(':')
    if (newValue.length === 3) {
      hours = newValue[0] * 60 * 60
      minute = newValue[1] * 60
      second = newValue[2]
    } else if (newValue.length === 2) {
      minute = newValue[0] * 60
      second = newValue[1]
    } else if (newValue.length === 1) {
      second = newValue[0]
    }
    result = hours + minute + Number(second)
  } else {
    // 数字转时间
    minute = Math.floor(value / 60)
    second = Math.floor(value % 60)
    // 分
    if (minute < 10) {
      minute = '0' + minute
    }
    // 秒
    if (second < 10) {
      second = '0' + second
    }
    // 输出小时
    if (isHours) {
      hours = Math.floor(value / 3600)
      // 时
      if (hours < 10) {
        hours = '0' + hours
      }
      result = hours + ':' + minute + ':' + second
    } else {
      result = minute + ':' + second
    }
  }
  return result
}

module.exports = {
  currentTime: currentTime,
  getcurrentTime: getcurrentTime,
  touchStart: touchStart,
  touchMove: touchMove,
  touchEnd: touchEnd,
  propDuration: propDuration,
  propProgressWidth: propProgressWidth,
  formatTime: formatTime,
  changeX: changeX
}
