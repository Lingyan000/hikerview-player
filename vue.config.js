const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src/renderer'))
      .set('~', resolve('src'))
      .set('root', resolve('./'))
      .set('#', resolve('src/universal'))
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      customFileProtocol: 'hvp://./',
      externals: ['hvp'],
      chainWebpackMainProcess: config => {
        config.resolve.alias
          .set('@', resolve('src/renderer'))
          .set('~', resolve('src'))
          .set('root', resolve('./'))
          .set('#', resolve('src/universal'))
          .set('apis', resolve('src/main/apis'))
      },
      builderOptions: {
        appId: 'com.Lingyan000.hikerviewplayer',
        productName: '海阔视界播放器',
        publish: [
          {
            provider: 'github',
            owner: 'Lingyan000',
            repo: 'hikerview-player',
            releaseType: 'draft'
          }
        ],
        dmg: {
          contents: [
            {
              x: 410,
              y: 150,
              type: 'link',
              path: '/Applications'
            },
            {
              x: 130,
              y: 150,
              type: 'file'
            }
          ]
        },
        copyright: 'Copyright © 2020',
        win: {
          icon: 'build/icons/icon.ico',
          target: [
            {
              target: 'nsis', // 利用nsis制作安装程序
              arch: [
                'x64', // 64位
                'ia32' // 32位
              ]
            }
          ]
        },
        mac: {
          icon: 'build/icons/icon.icns',
          extendInfo: {
            LSUIElement: 0
          }
        },
        nsis: {
          oneClick: false, // 是否一键安装
          allowToChangeInstallationDirectory: true, // 允许修改安装目录
          shortcutName: '海阔视界播放器' // 图标名称
        },
        linux: {
          icon: 'build/icons/'
        },
        snap: {
          publish: ['github']
        }
      }
    }
  }
}
