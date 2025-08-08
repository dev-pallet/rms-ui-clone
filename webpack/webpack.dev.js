const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const config = {
  mode: 'development',
  watch: true,
  devtool: 'inline-source-map',

  output: {
    hotUpdateChunkFilename: '.hot/hot-update.js',
    hotUpdateMainFilename: '.hot/hot-update.json',
  },

  // optimization: {
  //   minimize: true,
  //   minimizer: [new TerserPlugin({
  //     terserOptions: {
  //       compress: {
  //         unused: true,
  //         dead_code: true,
  //       },
  //       output: {
  //         comments: false,
  //       },
  //     },
  //     extractComments: false,
  //   })],
  // },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: true,
      'process.env.BABEL_TYPES_8_BREAKING': 'false',
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.MY_ENV': JSON.stringify(process.env.MY_ENV || 'development'),
      'process.env.REACT_APP_SITE_KEY': JSON.stringify(process.env.REACT_APP_SITE_KEY),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    static: {
      directory: './dist',
    },
    hot: true,
  },
};

module.exports = config;
