# 音频收集（榕声音档）微信小程序

此 package 包含封装好的榕声音档音频收集UI和逻辑，目标是可以被嵌入到榕典和其他小程序中。

## 本地开发

小程序的技术栈是 Taro。

你需要先安装 [yarn](https://yarnpkg.com/getting-started/install/)、[taro/cli](https://taro-docs.jd.com/taro/docs/GETTING-STARTED)

### 日常开发流程 

1. 运行 devserver:

  ```
  $ yarn dev:weapp
  ```

  > 如果微信开发者工具提示小程序打包后大小太大，可使用 `NODE_ENV=production yarn dev:weapp`。

2. 在「微信开发者工具」中添加小程序，选择目录为 [js/packages/audio-collector](.)
