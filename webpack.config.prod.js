var baseConfig = require('./webpack.config.common.js');
var webpack = require('webpack');
const merge = require('webpack-merge');
var path = require('path');

var OfflinePlugin = require('offline-plugin');

module.exports = merge(baseConfig, {
  output: {
    path: path.resolve(__dirname, './dist/static/'),
    publicPath: 'static/',
    filename: 'js/[name]-bundle.[chunkhash].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      // mangle breakes AngularJS
      mangle: false,
      output: {
        screw_ie8: true
      },
      exclude: [/\.min\.js$/gi]
    }),
    // it's always better if OfflinePlugin is the last plugin added
    new OfflinePlugin({
      ServiceWorker: {
        output: '../sw.js',
      },
    }),
  ],
});
