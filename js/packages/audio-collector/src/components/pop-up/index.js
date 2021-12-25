import { Block, View, Slot } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './index.scss'

@withWeapp({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    visible: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    popPreventTouchmove() {},
    popPreventTouchmove2() {},
    popPreventTouchmove3() {},
    cityChange() {},
    close() {
      this.triggerEvent('close')
    },
    handleClickMask(e) {
      // console.log(e)
      if (e.target.dataset.type !== 'unclose') this.close()
    }
  }
})
class _C extends React.Component {
  render() {
    const { visible } = this.data
    return (
      <View
        onTouchMove={this.privateStopNoop.bind(this, this.popPreventTouchmove)}
      >
        <View
          className={
            'q-pp-mask  ' + (visible ? 'q-pp-mask-show' : '') + ' ptp_exposure'
          }
          onClick={this.handleClickMask}
          onTouchMove={this.privateStopNoop.bind(
            this,
            this.popPreventTouchmove
          )}
          data-ptpid="0d05-191c-8bb6-b8fb"
        >
          <View
            className={'q-pp ' + (visible ? 'q-pp-show' : '')}
            onTouchMove={this.privateStopNoop.bind(
              this,
              this.popPreventTouchmove
            )}
          >
            {this.props.renderContent}
          </View>
        </View>
      </View>
    )
  }
}

export default _C
