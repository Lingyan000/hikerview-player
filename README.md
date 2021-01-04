<div align="center">
<img alt="Coolapk LOGO" src="./build/icons/256x256.png" width="150px" />

# Hikerview Player

> 海阔视界网页投屏播放器

[![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/Lingyan000/hikerview-player/Build/master?logo=github)](https://github.com/Lingyan000/hikerview-player/actions?query=workflow%3ABuild)
[![AppVeyor](https://img.shields.io/appveyor/build/Lingyan000/hikerview-player?logo=appveyor&logoColor=ffffff)](https://ci.appveyor.com/project/Lingyan000/hikerview-player)
[![hikerview-player LICENSE](https://img.shields.io/github/license/Lingyan000/hikerview-player)](https://github.com/Lingyan000/hikerview-player/blob/master/LICENSE)
[![GitHub all releases](https://img.shields.io/github/downloads/Lingyan000/hikerview-player/total?logo=github)](https://github.com/Lingyan000/hikerview-player/releases)
[![GitHub releases](https://img.shields.io/github/release/Lingyan000/hikerview-player?style=flat-square&logo=github)](https://github.com/Lingyan000/hikerview-player/releases/latest)
</div>

## 特色功能

- 通过 Electron 打包成软件杜绝视频跨域问题
- 支持解析海阔视界中带 headers 的播放链接

## 下载安装

点击此处下载 [应用](https://github.com/Lingyan000/hikerview-player/releases)。

### Windows

Windows 用户请下载最新版本的 `exe` 文件。

### macOS

macOS 用户请下载最新版本的 `dmg` 文件。

### Linux

Linux 用户请下载 `AppImage` 文件。


## 应用截图

![](https://cdn.jsdelivr.net/gh/Lingyan000/pic@master/img/20210104220019.png)

## 开发说明

> 目前仅针对 Mac、Windows。Linux 平台并未测试。

1. 你需要有 Node、Git 环境，了解 npm 的相关知识。
2. `git clone https://github.com/Lingyan000/hikerview-player.git` 并进入项目。
3. `yarn` 下载依赖。注意如果你没有 `yarn`，请去 [官网](https://classic.yarnpkg.com/en/docs/install) 下载安装后再使用。 **用 `npm install` 将导致未知错误！**
4. Mac 需要有 Xcode 环境，Windows 需要有 VS 环境。

### 开发模式

输入 `npm run electron:serve` 进入开发模式，开发模式具有热重载特性。不过需要注意的是，开发模式不稳定，会有进程崩溃的情况。此时需要：

```bash
ctrl+c # 退出开发模式
npm run electron:serve # 重新进入开发模式
```

### 生产模式

如果你需要自行构建，可以 `npm run electron:build` 开始进行构建。构建成功后，会在 `dist_electron` 目录里出现构建成功的相应安装文件。

**注意**：如果你的网络环境不太好，可能会出现 `electron-builder` 下载 `electron` 二进制文件失败的情况。这个时候需要在 `npm run electron:build` 之前指定一下 `electron` 的源为国内源：

```bash
export ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"
# 在 Windows 上，则可以使用 set ELECTRON_MIRROR=https://npm.taobao.org/mirrors/electron/ （无需引号）
npm run electron:build
```

只需第一次构建的时候指定一下国内源即可。后续构建不需要特地指定。二进制文件下载在 `~/.electron/` 目录下。如果想要更新 `electron` 构建版本，可以删除 `~/.electron/` 目录，然后重新运行上一步，让 `electron-builder `去下载最新的 `electron` 二进制文件。

## 鸣谢

- [Electron](https://github.com/electron/electron) 使一切成为可能
- [Vue.js](https://github.com/vuejs/vue) 渐进式
 JavaScript 框架
- [video.js](https://github.com/videojs/video.js) 好用的 H5 播放器
- [PicGo](https://github.com/Molunerfinn/PicGo) 学习了这个项目的开发结构
- [海阔视界](http://haikuoshijie.cn/) 没有它就没有这个项目

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2020 Lingyan000