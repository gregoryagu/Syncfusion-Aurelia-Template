const path = require("path");
const webpack = require("webpack");
const { AureliaPlugin, ModuleDependenciesPlugin, GlobDependenciesPlugin } = require("aurelia-webpack-plugin");
const bundleOutputDir = "./wwwroot/dist";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, args) => {
	let isDevBuild = true;  //Assume isDevBuild;

	//If being run from NPM, args.mode will be populated
	if (args && args.mode === 'production') {
		isDevBuild = false;
	}

	//Not production mode from NPM, check on Production mode from Task Runner
	if (isDevBuild) {
		//If being run from the Webpack Task Runner in VS.
		const node_env = process.env.NODE_ENV

		if (node_env) {
			if (node_env === 'production') {
				isDevBuild = false;
			}
			else {
			}
		}
	}
	//isDevBuild = true;//Uncomment to test the Prod Build
	console.log('isDevBuild=' + isDevBuild);
	const cssLoader = { loader: isDevBuild ? "css-loader" : "css-loader?minimize" };
	return [{
		target: "web",
		mode: isDevBuild ? "development" : "production",
		entry: { "app": ["es6-promise/auto", "aurelia-bootstrapper"] },
		resolve: {
			extensions: [".ts", ".js"],
			modules: ["ClientApp", "node_modules"]
		},
		output: {
			path: path.resolve(bundleOutputDir),
			publicPath: "/dist/",
			filename: "[name].js",
			chunkFilename: "[name].js"
		},
		module: {
			rules: [
				{ test: /\.(woff|woff2)(\?|$)/, loader: "url-loader?limit=1" },
				{ test: /\.(png|eot|ttf|svg|gif|cur)(\?|$)/, loader: "url-loader?limit=100000" },
				{ test: /\.ts$/i, include: [/ClientApp/, /node_modules/], use: "awesome-typescript-loader" },
				{ test: /\.html$/i, use: "html-loader" },
				{
					test: /\.css$/, include: [/node_modules/], use: [
						{
							loader: MiniCssExtractPlugin.loader
						},
						"css-loader"
					]
				},
				{
					test: /\.css$/, exclude: [/node_modules/], use: [
						{
							loader: MiniCssExtractPlugin.loader
						},
						"css-loader"
					]
				},
				{ test: /\.scss$/i, issuer: /(\.html|empty-entry\.js)$/i, use: [cssLoader, "sass-loader"] },
				{ test: /\.scss$/i, issuer: /\.ts$/i, use: ["style-loader", cssLoader, "sass-loader"] }
			]
		},
		optimization: {
			splitChunks: {
				cacheGroups: {
					commons: {
						test: /[\\/]node_modules[\\/]/,
						name: "vendor",
						chunks: "all"
					}
				}
			}
		},
		devtool: isDevBuild ? "source-map" : false,
		performance: {
			hints: false
		},
		plugins: [
			new webpack.DefinePlugin({ IS_DEV_BUILD: JSON.stringify(isDevBuild) }),
			new webpack.ProvidePlugin({ $: "jquery", jQuery: "jquery", "window.jQuery": "jquery" }),
			new webpack.ProvidePlugin({
				'Promise': 'bluebird'
			}),

			new AureliaPlugin({ aureliaApp: "boot" }),
			new GlobDependenciesPlugin({ "boot": ["ClientApp/**/*.{ts,html}"] }),
			new ModuleDependenciesPlugin({}),
			//extractCSS,
			new ModuleDependenciesPlugin({
				"aurelia-orm": [
					"./component/association-select",
					"./component/view/bootstrap/association-select.html",
					"./component/view/bootstrap/paged.html",
					"./component/paged"],
				"aurelia-authentication": ["./authFilterValueConverter"]
			}),

			new MiniCssExtractPlugin({
				// Options similar to the same options in webpackOptions.output
				// both options are optional
				filename: "[name].css",
				chunkFilename: "[id].css"
			})

		]
	}];
};
