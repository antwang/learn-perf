const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const StyleLintPlugin = require("stylelint-webpack-plugin");
const SpritesmithPlugin = require("webpack-spritesmith");
const DebugPlugin = require("debugtool-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const { templateFunction } = require("./util");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const webpack = require("webpack");

const baseConf = {
  entry: { app: path.resolve(__dirname, "../src/app.js") },
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "../dist")
  },
  resolve: {
    modules: ["../node_modules", "../src/assets/generated"]
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        enforce: "pre",
        options: {
          formatter: require("eslint-friendly-formatter")
        }
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: "vue-loader"
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new DebugPlugin({ enable: false }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
      title: "项目模板"
    }),
    new webpack.DllReferencePlugin({
      manifest: require("../dll/vue.manifest.json")
    }),
    // 将dll文件添加到html中，必须放在htmlwebpackPlugin后面
    new AddAssetHtmlPlugin({
      filepath: path.resolve(__dirname, "../dll/*.dll.js"),
      outputPath: "js",
      publicPath: "js"
    }),
    new StyleLintPlugin({
      files: ["src/**/*.{vue,css,sass,scss}"]
    }),
    new SpritesmithPlugin({
      src: {
        cwd: path.resolve(__dirname, "../src/assets/sprites"),
        glob: "*.png"
      },
      customTemplates: {
        function_based_template: templateFunction
      },
      target: {
        image: path.resolve(__dirname, "../src/assets/generated/sprite.png"),
        css: [
          [
            path.resolve(__dirname, "../src/assets/generated/sprite2.scss"),
            {
              format: "function_based_template"
            }
          ],
          path.resolve(__dirname, "../src/assets/generated/sprite.scss")
        ]
      },
      apiOptions: {
        cssImageRef: "~sprite.png"
      }
    }),
    new HardSourceWebpackPlugin()
  ]
};
module.exports = baseConf;
