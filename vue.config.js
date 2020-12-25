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
				win: {
					icon: './public/app.ico'
				},
				mac: {
					icon: './public/app.png'
				}
			},
			productName: '海阔视界播放器'
		}
	}
};
