module.exports = {
	mode: "production",
	entry: "./app/index.js",
	devtool: "inline-source-map",
	target: "web",
	module: {
		rules: [
			{
				test: [/\.js$/, /\.jsx$/],
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							["@babel/preset-env", {targets: {esmodules: true}}],
							"@babel/preset-react"
						]
					}
				}
			},
			{
				test: /\.(s[ac]ss|css)$/i,
				use: ["style-loader", "css-loader"]
			}
		]
	},
	resolve: {extensions: [".js", ".jsx"]},
	output: {
		filename: "index.js",
		path: `${__dirname}/app/public`
	}
}
