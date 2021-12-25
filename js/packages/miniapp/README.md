# 榕典 微信小程序

## 本地开发

小程序的技术栈是 Taro。
你需要先安装 [yarn](https://yarnpkg.com/getting-started/install/)、[taro/cli](https://taro-docs.jd.com/taro/docs/GETTING-STARTED)


### 日常开发流程 

1. 运行 devserver:

  ```
  $ yarn dev:weapp
  ```

  > 如果微信开发者工具提示小程序打包后大小太大，可使用 `NODE_ENV=production yarn dev:weapp`。

2. 在「微信开发者工具」中添加小程序，选择目录为 [js/packages/miniapp](.)

### 部署流程 

本 package 有[自动化建构](/.azure/pipelines/miniapp.yml)，只要创建Pull Request，等待 "miniapp" 步骤完成建构，即可在小程序后台找到自动构建的版本。

如需手动打包小程序，运行：

  ```
  $ yarn build:weapp
  ```

然后在「微信开发者工具」中进行部署。