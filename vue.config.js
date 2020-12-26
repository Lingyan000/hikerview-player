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
				appId: "com.hikerview.player",
				productName: '海阔视界播放器',
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
				}
			},
		}
	}
};
