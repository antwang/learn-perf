const merge = require("webpack-merge");
const baseConf = require("./webpack.config.base");
const path = require("path");
const { configureURLLoader } = require("./util");
const devServer = {
  proxy: {
    "/api": "http://localhost:8081"
  },
  contentBase: path.resolve(__dirname, "../dist"),
  hot: true,
  clientLogLevel: "warning",
  compress: true,
  overlay: true,
  open: true,
  port: 3000
};
module.exports = merge(baseConf, {
  mode: "development",
  devServer,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          { loader: "thread-loader" },
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"]
      },
      ...configureURLLoader()
    ]
  }
});
