import { Block, View, Canvas, Image } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './index.scss'
module.exports = /******/ (function(modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/ var installedModules = {} // The require function
  /******/
  /******/ /******/ function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId]) {
      /******/ return installedModules[moduleId].exports
      /******/
    } // Create a new module (and put it into the cache)
    /******/ /******/ var module = (installedModules[moduleId] = {
      /******/ i: moduleId,
      /******/ l: false,
      /******/ exports: {}
      /******/
    }) // Execute the module function
    /******/
    /******/ /******/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    ) // Flag the module as loaded
    /******/
    /******/ /******/ module.l = true // Return the exports of the module
    /******/
    /******/ /******/ return module.exports
    /******/
  } // expose the modules object (__webpack_modules__)
  /******/
  /******/
  /******/ /******/ __webpack_require__.m = modules // expose the module cache
  /******/
  /******/ /******/ __webpack_require__.c = installedModules // define getter function for harmony exports
  /******/
  /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
    /******/ if (!__webpack_require__.o(exports, name)) {
      /******/ Object.defineProperty(exports, name, {
        enumerable: true,
        get: getter
      })
      /******/
    }
    /******/
  } // define __esModule on exports
  /******/
  /******/ /******/ __webpack_require__.r = function(exports) {
    /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      /******/ Object.defineProperty(exports, Symbol.toStringTag, {
        value: 'Module'
      })
      /******/
    }
    /******/ Object.defineProperty(exports, '__esModule', { value: true })
    /******/
  } // create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require
  /******/
  /******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function(
    value,
    mode
  ) {
    /******/ if (mode & 1) value = __webpack_require__(value)
    /******/ if (mode & 8) return value
    /******/ if (
      mode & 4 &&
      typeof value === 'object' &&
      value &&
      value.__esModule
    )
      return value
    /******/ var ns = Object.create(null)
    /******/ __webpack_require__.r(ns)
    /******/ Object.defineProperty(ns, 'default', {
      enumerable: true,
      value: value
    })
    /******/ if (mode & 2 && typeof value != 'string')
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function(key) {
            return value[key]
          }.bind(null, key)
        )
    /******/ return ns
    /******/
  } // getDefaultExport function for compatibility with non-harmony modules
  /******/
  /******/ /******/ __webpack_require__.n = function(module) {
    /******/ var getter =
      module && module.__esModule
        ? /******/ function getDefault() {
            return module['default']
          }
        : /******/ function getModuleExports() {
            return module
          }
    /******/ __webpack_require__.d(getter, 'a', getter)
    /******/ return getter
    /******/
  } // Object.prototype.hasOwnProperty.call
  /******/
  /******/ /******/ __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property)
  } // __webpack_public_path__
  /******/
  /******/ /******/ __webpack_require__.p = '' // Load entry module and return exports
  /******/
  /******/
  /******/ /******/ return __webpack_require__((__webpack_require__.s = 3))
  /******/
})(
  /************************************************************************/
  /******/ [
    /* 0 */
    /***/ function(module, exports) {
      module.exports = require('lucky-canvas')

      /***/
    },
    /* 1 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict'

      exports.__esModule = true
      exports.getImage = getImage
      var windowWidth = Taro.getSystemInfoSync().windowWidth

      var rpx2px = (exports.rpx2px = function rpx2px(value) {
        if (typeof value === 'string')
          value = Number(value.replace(/[a-z]*/g, ''))
        return (windowWidth / 750) * value
      })

      var changeUnits = (exports.changeUnits = function changeUnits(value) {
        return Number(
          value.replace(/^(\-*[0-9.]*)([a-z%]*)$/, function(value, num, unit) {
            switch (unit) {
              case 'px':
                num *= 1
                break
              case 'rpx':
                num = rpx2px(num)
                break
              default:
                num *= 1
                break
            }
            return num
          })
        )
      })

      var resolveImage = (exports.resolveImage = function resolveImage(
        e,
        img,
        canvas
      ) {
        var srcName =
          arguments.length > 3 && arguments[3] !== undefined
            ? arguments[3]
            : 'src'
        var resolveName =
          arguments.length > 4 && arguments[4] !== undefined
            ? arguments[4]
            : '$resolve'

        var imgObj = canvas.createImage()
        imgObj.onload = function() {
          img[resolveName](imgObj)
        }
        imgObj.src = img[srcName]
      })

      function getImage() {
        var _this = this

        return new Promise(function(resolve, reject) {
          Taro.canvasToTempFilePath({
            canvas: _this.canvas,
            success: function success(res) {
              return resolve(res)
            },
            fail: function fail(err) {
              return reject(err)
            }
          })
        })
      }

      /***/
    },
    ,
    /* 2 */
    /* 3 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict'

      var _luckyCanvas = __webpack_require__(0)

      /***/ var _utils = __webpack_require__(1)
    }
  ]
  /******/
)
//# sourceMappingURL=index.js.map

@withWeapp({
  properties: {
    width: { type: String, value: '600rpx' },
    height: { type: String, value: '600rpx' },
    rows: { type: String, optionalTypes: [Number], value: '3' },
    cols: { type: String, optionalTypes: [Number], value: '3' },
    blocks: { type: Array, value: [] },
    prizes: { type: Array, value: [] },
    buttons: { type: Array, value: [] },
    defaultConfig: { type: Object, value: {} },
    defaultStyle: { type: Object, value: {} },
    activeStyle: { type: Object, value: {} },
    start: { type: Function, value: function value() {} },
    end: { type: Function, value: function value() {} }
  },
  data: {
    isShow: false,
    luckyImg: '',
    showCanvas: true
  },
  observers: {
    'prizes.**': function prizes(newData, oldData) {
      this.$lucky && (this.$lucky.prizes = newData)
    },
    'buttons.**': function buttons(newData, oldData) {
      this.$lucky && (this.$lucky.buttons = newData)
    }
  },
  ready: function ready() {
    var _this = this

    Taro.createSelectorQuery()
      .in(this)
      .select('#lucky-grid')
      .fields({
        node: true,
        size: true
      })
      .exec(function(res) {
        if (!res[0] || !res[0].node) {
          console.error('lucky-canvas 获取不到 canvas 标签')
          return
        }
        var canvas = (_this.canvas = res[0].node)
        var dpr = (_this.dpr = Taro.getSystemInfoSync().pixelRatio)
        var ctx = (_this.ctx = canvas.getContext('2d'))
        var data = _this.data
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)
        _this.$lucky = new _luckyCanvas.LuckyGrid(
          {
            flag: 'MP-WX',
            ctx: ctx,
            dpr: dpr,
            width: res[0].width,
            height: res[0].height,
            // rAF: canvas.requestAnimationFrame, // 帧动画真机调试会报错!
            setTimeout: setTimeout,
            clearTimeout: clearTimeout,
            setInterval: setInterval,
            clearInterval: clearInterval,
            unitFunc: function unitFunc(num, unit) {
              return (0, _utils.changeUnits)(num + unit)
            }
          },
          {
            rows: data.rows,
            cols: data.cols,
            blocks: data.blocks,
            prizes: data.prizes,
            buttons: data.buttons,
            defaultConfig: data.defaultConfig,
            defaultStyle: data.defaultStyle,
            activeStyle: data.activeStyle,
            start: function start() {
              for (
                var _len = arguments.length, rest = Array(_len), _key = 0;
                _key < _len;
                _key++
              ) {
                rest[_key] = arguments[_key]
              }

              _this.triggerEvent.apply(_this, ['start'].concat(rest))
            },
            end: function end() {
              for (
                var _len2 = arguments.length, rest = Array(_len2), _key2 = 0;
                _key2 < _len2;
                _key2++
              ) {
                rest[_key2] = arguments[_key2]
              }

              _this.triggerEvent.apply(_this, ['end'].concat(rest))
              _utils.getImage.call(_this).then(function(res) {
                _this.setData({ luckyImg: res.tempFilePath })
              })
            }
          }
        )
        // 为了保证 onload 回调准确
        _this.setData({ isShow: true })
      })
  },

  methods: {
    imgBindload: function imgBindload(e) {
      var _e$currentTarget$data = e.currentTarget.dataset,
        name = _e$currentTarget$data.name,
        index = _e$currentTarget$data.index,
        i = _e$currentTarget$data.i

      var img = this.data[name][index].imgs[i]
      ;(0, _utils.resolveImage)(e, img, this.canvas)
    },
    imgBindloadActive: function imgBindloadActive(e) {
      var _e$currentTarget$data2 = e.currentTarget.dataset,
        name = _e$currentTarget$data2.name,
        index = _e$currentTarget$data2.index,
        i = _e$currentTarget$data2.i

      var img = this.data[name][index].imgs[i]
      ;(0, _utils.resolveImage)(
        e,
        img,
        this.canvas,
        'activeSrc',
        '$activeResolve'
      )
    },
    luckyImgLoad: function luckyImgLoad() {
      this.showCanvas = false
    },
    handleClickOfImg: function handleClickOfImg(e) {
      var _this2 = this

      var _e$changedTouches$ = e.changedTouches[0],
        x = _e$changedTouches$.clientX,
        y = _e$changedTouches$.clientY

      Taro.createSelectorQuery()
        .in(this)
        .select('.lucky-img')
        .fields({
          rect: true
        })
        .exec(function(res) {
          var _res$ = res[0],
            left = _res$.left,
            top = _res$.top

          _this2.toPlay(x - left, y - top)
        })
    },
    handleClickOfCanvas: function handleClickOfCanvas(e) {
      var _e$changedTouches$2 = e.changedTouches[0],
        x = _e$changedTouches$2.x,
        y = _e$changedTouches$2.y

      this.toPlay(x, y)
    },
    toPlay: function toPlay(x, y) {
      var _this3 = this

      var ctx = this.ctx
      this.data.buttons.forEach(function(btn) {
        if (!btn) return
        ctx.beginPath()
        ctx.rect.apply(
          ctx,
          _this3.$lucky.getGeometricProperty([
            btn.x,
            btn.y,
            btn.col || 1,
            btn.row || 1
          ])
        )
        if (!ctx.isPointInPath(x * _this3.dpr, y * _this3.dpr)) return
        // 隐藏图片并显示canvas
        _this3.showCanvas = true
        _this3.setData({ luckyImg: '' })
        // 触发 lucky-canvas 的抽奖逻辑
        _this3.$lucky.startCallback()
      })
    },
    play: function play() {
      var _$lucky

      ;(_$lucky = this.$lucky).play.apply(_$lucky, arguments)
    },
    stop: function stop() {
      var _$lucky2

      ;(_$lucky2 = this.$lucky).stop.apply(_$lucky2, arguments)
    }
  }
})
class _C extends React.Component {
  render() {
    const {
      width,
      height,
      showCanvas,
      luckyImg,
      prizes,
      isShow,
      buttons
    } = this.data
    return (
      <View
        className="lucky-box"
        style={'width: ' + width + '; height: ' + height}
      >
        <Canvas
          type="2d"
          id="lucky-grid"
          canvasId="lucky-grid"
          onTouchStart={this.handleClickOfCanvas}
          style={
            'width: ' +
            width +
            '; height: ' +
            height +
            '; visibility: ' +
            (showCanvas ? 'visible' : 'hidden')
          }
        ></Canvas>
        {luckyImg && (
          <Image
            src={luckyImg}
            className="lucky-img"
            mode="scaleToFill"
            onLoad={this.luckyImgLoad}
            onTouchStart={this.handleClickOfImg}
            style={'width: ' + width + '; height: ' + height}
          ></Image>
        )}
        {prizes.map((item, index) => {
          return (
            <View>
              {isShow && (
                <Block>
                  {prizes.map((prize, index) => {
                    return (
                      <View
                        key={prize.index}
                        style="visibility: hidden; height: 0"
                      >
                        {prize.imgs.map((img, i) => {
                          return (
                            <View key={img.i}>
                              <Image
                                src={img.src}
                                data-name="prizes"
                                data-index={index}
                                data-i={i}
                                onLoad={this.imgBindload}
                              ></Image>
                              <Image
                                src={img.activeSrc}
                                data-name="prizes"
                                data-index={index}
                                data-i={i}
                                onLoad={this.imgBindloadActive}
                              ></Image>
                            </View>
                          )
                        })}
                      </View>
                    )
                  })}
                </Block>
              )}
            </View>
          )
        })}
        {buttons.map((item, index) => {
          return (
            <View>
              {isShow && (
                <Block>
                  {buttons.map((btn, index) => {
                    return (
                      <View
                        key={btn.index}
                        style="visibility: hidden; height: 0"
                      >
                        {btn.imgs.map((img, i) => {
                          return (
                            <View key={img.i}>
                              <Image
                                src={img.src}
                                data-name="buttons"
                                data-index={index}
                                data-i={i}
                                onLoad={this.imgBindload}
                              ></Image>
                            </View>
                          )
                        })}
                      </View>
                    )
                  })}
                </Block>
              )}
            </View>
          )
        })}
      </View>
    )
  }
}

export default _C
