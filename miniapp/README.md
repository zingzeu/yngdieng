# 榕典 小程序端

## 本地开发

小程序的技术栈是 Taro。
你需要先安装 [yarn](https://yarnpkg.com/getting-started/install/)、[taro/cli](https://taro-docs.jd.com/taro/docs/GETTING-STARTED)


### 日常开发流程 Example development workflow

1. 运行 devserver:

  ```
  $ yarn dev:weapp
  ```

  > 如果微信开发者工具提示小程序打包后大小太大，可使用 `NODE_ENV=production yarn dev:weapp。

2. 在「微信开发者工具」中添加小程序，选择目录为 [miniapp](.)

### 部署流程 Example deploy workflow

1. 打包小程序

  ```
  $ yarn build:weapp
  ```
2. 在「微信开发者工具」中进行部署
