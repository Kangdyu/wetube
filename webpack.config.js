const path = require("path");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");

const mode = process.env.NODE_ENV;

module.exports = {
  devtool: "cheap-module-source-map",
  mode: mode,
  entry: ["@babel/polyfill", "./assets/js/main.js"],
  output: {
    filename: "[name].js",
    path: path.resolve("./dist"),
  },
  module: {
    rules: [
      {
        test: /\.(s[ac]ss|css)$/,
        use: [
          MiniCSSExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins() {
                return [autoprefixer()];
              },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new MiniCSSExtractPlugin({ filename: "[name].css" })],
};
