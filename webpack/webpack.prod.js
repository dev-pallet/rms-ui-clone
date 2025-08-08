const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: false,
      'process.env.BABEL_TYPES_8_BREAKING': 'false',
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.MY_ENV': JSON.stringify(process.env.MY_ENV),
      'process.env.REACT_APP_SITE_KEY': JSON.stringify(process.env.REACT_APP_SITE_KEY),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css',
    }),
  ],
};

module.exports = config;