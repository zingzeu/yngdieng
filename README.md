# 榕典 Yngdieng

> ⚠️ 榕典尚处于开发早期阶段。你可以通过 [Issues 列表](https://github.com/MindongLab/yngdieng/issues)跟踪项目进度或参与讨论。

福州话在线词典 Online Hokchew Dictionary

[![Build Status](https://mindonglab.visualstudio.com/yngdieng/_apis/build/status/MindongLab.yngdieng?branchName=master)](https://mindonglab.visualstudio.com/yngdieng/_build/latest?definitionId=1&branchName=master)

[需求文档](https://shimo.im/docs/35c397ff76b647b1) | [UI 设计](https://www.figma.com/file/FoQGpsir7cH4GSYenYqObf/%E6%A6%95%E5%85%B8) | [开发看板](https://github.com/MindongLab/yngdieng/projects/1)

## 本地 Web 开发 Local web development

Web app 技术栈是 Angular + Typescript，建构系统是 Bazel。
你需要先安装 [yarn](https://yarnpkg.com/getting-started/install/)。

代码位置在 [web/src](web/src)。

### 日常开发流程 Example development workflow

1. 作出代码修改。

2. 运行 devserver：

   ```
   $ yarn install
   $ yarn bazel run //web/src:devserver
   ```
   
   > 或者使用 `yarn serve`，通过 [iBazel](https://github.com/bazelbuild/bazel-watcher) 跟踪文件变化，并在你保存文件时自动重新建构 devserver。
   
3. 在浏览器中打开 `http://localhost:4200`，进行手工测试。

