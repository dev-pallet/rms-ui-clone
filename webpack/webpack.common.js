const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const assetsPluginInstance = new AssetsPlugin();
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV !== 'production';
const prodMode = process.env.NODE_ENV === 'production';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
  stats: {},
  // watch: true,

  // entry: ['webpack-hot-middleware/client', './client/src/index.tsx'],
  entry: {
    main: [
      './client/src/index.js',
      devMode ? 'webpack-hot-middleware/client?path=/__webpack_hmr&reload=false' : null,
    ].filter(Boolean),
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    publicPath: '/dist/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          devMode || prodMode ?   'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
          'postcss-loader',
        ],
        include: /\.module\.css$/,
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(svg|mp3|wav)$/,
        use: 'file-loader',
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
    ],
  },
  plugins: [
    //new BundleAnalyzerPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    assetsPluginInstance,
    new LodashModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    // ADD in dev only
  ],

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      assets: path.resolve(__dirname, '../client/src/assets'),
      components: path.resolve(__dirname, '../client/src/components'),
      config: path.resolve(__dirname, '../client/src/config'),
      context: path.resolve(__dirname, '../client/src/context'),
      examples: path.resolve(__dirname, '../client/src/examples'),
      layouts: path.resolve(__dirname, '../client/src/layouts'),
      App: path.resolve(__dirname, '../client/src/App'),
      routes: path.resolve(__dirname, '../client/src/routes'),
      datamanagement: path.resolve(__dirname, '../client/src/datamanagement'),
      'page.routes': path.resolve(__dirname, '../client/src/page.routes.js'),
    },
  },
  optimization: {
    //runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
};

module.exports = config;
