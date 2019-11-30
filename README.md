# [RSS](https://github.com/nusr/RSS)

模仿 [Reeder](https://www.reederapp.com/) 的 RSS 阅读器

## 安装依赖

```bash
yarn
```

## 开发

```bash
yarn dev
```

## 打包

```bash
# 打包成 mac
yarn package:mac
# 打包成 linux
yarn package:linux
# 打包成 windows
yarn package:win
# 打包三个平台
yarn package
```

## 解决打包中的问题

1. 解决 Electron 下载失败

打包时，electron-builder 会下载下 [https://github.com/electron/electron/releases/download/v7.1.2/electron-v7.1.2-darwin-x64.zip](https://github.com/electron/electron/releases/download/v7.1.2/electron-v7.1.2-darwin-x64.zip)，但是一直下载失败，无法打包成功。
解决方法是从浏览器下载下面的文件，放到如下目录：

- Linux: \$XDG_CACHE_HOME or ~/.cache/electron/
- MacOS: ~/Library/Caches/electron/
- Windows: %LOCALAPPDATA%/electron/Cache or ~/AppData/Local/electron/Cache/

2. 解决 electron-builder 需要的包下载失败

参考[https://github.com/electron-userland/electron-builder/issues/1859](https://github.com/electron-userland/electron-builder/issues/1859)
