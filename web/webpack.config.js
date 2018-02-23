const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

let ifDev = false;
let ifProduction = true;
if (process.env.CRYP_ENV == "dev") {
    ifDev = true;
    ifProduction = false;
}

module.exports = [
    {
        context: path.resolve(__dirname),
        entry: "./js/global.js",
        output: {
            filename: "global.js",
            path: path.resolve(__dirname, "static")
        },
        module: {
            loaders: [{
                test: /\.js$/,
                loader: "babel-loader",
                query: {
                    presets: ["env"]
                }
            }]
        },
        plugins: (() => {
            let arr = [];
            if (ifProduction) {
                arr.push(
                    new webpack.optimize.UglifyJsPlugin({
                        compress: {
                            warnings: false,
                            drop_console: false,
                        }
                    })
                );
            }
        })()
    },
    {
        context: path.resolve(__dirname),
        entry: "./sass/global.sass",
        output: {
            filename: "sass.webpack.js",
            path: path.resolve(__dirname, "static")
        },
        module: {
            rules: [{
                test: /\.sass$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                minimize: ifProduction
                            }
                        },
                        {
                            loader: "sass-loader"
                        }
                    ]
                })
            }]
        },
        plugins: [
            new ExtractTextPlugin({
                filename: "global.css"
            })
        ]
    }
]
