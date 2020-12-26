const path = require("path");

function resolve(dir) {
	return path.join(__dirname, dir);
}

module.exports = {
	publicPath: "./",
	devServer: {
		host: "0.0.0.0",
		port: 8080
	},
	configureWebpack: {
		name: "海阔视界播放器",
		resolve: {
			alias: {
				'@': resolve('src')
			}
		}
	},
	pluginOptions: {
		electronBuilder: {
			builderOptions: {
				appId: "com.Lingyan000.hikerviewplayer",
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
				copyright: "Copyright © 2020",
				win: {
					icon: './public/app.ico',
					target: [
						{
							target: "nsis", // 利用nsis制作安装程序
							arch: [
								"x64", // 64位
								"ia32" // 32位
							]
						}
					]
				},
				mac: {
					icon: './public/app.png'
				},
				nsis: {
					"oneClick": false, // 是否一键安装
					"allowToChangeInstallationDirectory": true, // 允许修改安装目录
					"shortcutName": "海阔视界播放器", // 图标名称
				},
			},
		}
	}
};
