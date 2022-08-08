# 南川笔记 | 也许全网最好的油猴教程

date: 2022/07/01

> 很久很久以前，我就接触了tampermonkey（油猴）这款浏览器插件，知道它允许用户修改网页的呈现。几年间，断断续续地也研究过一阵，例如去年还借鉴别人开发过一款大麦网抢票插件（其实就是把原先的js版改成了react版），但仅此而已。
> 
> 由于油猴脚本默认在开发者（费老大力）提供的编辑器内去书写，体验十分之差（实则比微信小程序的开发者工具还要蛋疼）。但就在前两天，我无意间看到了某位网友使用webpack开发油猴的思路（尽管他做的花里胡哨，还开了个localhost:8080的端口），但不禁让我脑洞大开：既然油猴脚本实际上接收的是一个js文件，那么我以某种形式先生成一个js文件，然后再喂给油猴不就行了吗？这样就不必使用那个严重阻碍生产积极性的编辑器了！
> 
> 说干就干，熬了一个通宵，结果让我喜出望外，几乎创造式地解决了油猴开发上的一切不便问题，实现了完全本地化、同步化、组件化，将我过往的前端、后端技能全都串了起来，至此，油猴的大门正式向我打开。我确信我将乐于基于油猴这个工具主宰网页的掌控权，为解决未来的问题准备好了一把无往不克的利剑。

## Overview

1. :white_check_mark: 配置本地IDE以获取完整、可拓展的自动补全、智能跳转等编辑特性；
2. :white_check_mark: 将油猴脚本设置为与本地同步，从而无需打开油猴编辑器；
3. :white_check_mark: 使用typescript以提高代码质量
4. :white_check_mark: 使用webpack以解决ts打包问题，并实现自动打包
6. :white_check_mark: 选择React开发可复用的高质量组件

## 豆瓣筛房系统

### 前后对比

![picture 1](https://mark-vue-oss.oss-cn-hangzhou.aliyuncs.com/TamperMonkey-howto-1656627698147-ff9f02fb78ab095a6f7eae5afab45c7119b6f16da3b744a404243b77707ea6ca.png)  

![picture 2](https://mark-vue-oss.oss-cn-hangzhou.aliyuncs.com/TamperMonkey-howto-1656627705279-372ff35aa051fcd62eaa65dcf6e508eb2584eba499d7a91bea72700d411ff0a4.png)  


## 油猴脚本开发环境搭建

### Step 1：【必须】油猴自动读取本地文件

### Step 2：【必须】灵活使用mdn，jquery其实并无太大必要

ref:

- [Document.querySelector() - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)

- [Document.querySelectorAll() - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)

### Step 3：【推荐】vscode/WebStorm使用typescript开发

!!! tip tsc自动编译
    `Command + Shift + B`，选择watch即可。
    如果有多个tsconfig文件，则需要仔细选择。
    see: [typescript - Visual Studio Code compile on save - Stack Overflow](https://stackoverflow.com/questions/29996145/visual-studio-code-compile-on-save)

!!! tip 配置vscode隐藏js文件
    see: [Hiding js and js.map files in VS Code for your typescript projects - Pradeep Loganathan](https://pradeeploganathan.com/typescript/hiding-js-and-js-map-files-in-vs-code-for-your-typescript-projects/#:~:text=Luckily%20VScode%20allows%20us%20to,box%20to%20select%20Workspace%20Settings.&text=voila%2C%20all%20js%20files%20with%20a%20corresponding%20ts%20file%20are%20hidden.)

!!! failure 涉及到引用时，无法打包成一个文件
    在仅使用tsc的情况下，tsc只可以打包`amd`或者`system`模块，而`commonjs`是不支持的，我尝试将module改成`amd`或`system`，发现打包成功但在油猴里无法使用，前者提示`define`后者提示`System`无法解释。
    在stackoverflow上搜索如何使用tsc打包commonjs，得到的结论是没有办法，除非上webpack！

### Step 4：【推荐】配置webpack，实现无忧打包

see:
1. [TypeScript | webpack](https://webpack.js.org/guides/typescript/#basic-setup)
2. [Getting Started | webpack](https://webpack.js.org/guides/getting-started/#basic-setup)

```sh
npm install --save-dev webpack webpack-cli typescript ts-loader
npx webpack
```

!!! tip webpack自动编译
    see: https://stackoverflow.com/a/47125542/9422455
    `npx webpack --watch` 或者在`webpack.config.js`中加入`watch: true`。

!!! tip 压缩文件体积（差地还是很大的）
    `mode: "development"`

### Step 5：【推荐】配置一个拿手的前端框架，例如：React

## 油猴涉及技术概览

### 使用iframe

[嵌入的iframe又不能访问了？还有这些你不知道的事 - 掘金](https://juejin.cn/post/6991828558096105485) 中比较清晰地讲说明了iframe是什么，有什么限制（X-Frame-Options），以及提供了几个没有限制的网站：

- [花瓣网 - 陪你做生活的设计师（创意灵感天堂，搜索、发现设计灵感、设计素材）](https://huaban.com/)
- [淘宝网 - 淘！我喜欢](https://www.taobao.com/)
- [北京美团网-北京美食_酒店_旅游_团购_电影_吃喝玩乐](https://bj.meituan.com/)
