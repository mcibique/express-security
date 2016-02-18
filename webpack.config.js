const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isDebug = process.argv.indexOf('-p') < 0;

module.exports = {
  cache: true,
  entry: {
    app: './client/main.js',
    vendor: ['jquery']
  },
  output: {
    path: './public/scripts/',
    filename: 'app.min.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"'
    }),
    new ExtractTextPlugin('../styles/[name].min.css'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin(/* chunkName */'vendor', /* filename */'vendor.min.js'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }, {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss!sass')
      }
    ]
  },
  sassLoader: {
    includePaths: [
      path.resolve(__dirname, './node_modules/normalize-scss/sass'),
      path.resolve(__dirname, './node_modules/support-for/sass')
    ]
  },
  postcss: [autoprefixer({
    browsers: ['last 2 versions', 'ie >= 8', 'ff >= 2'],
    cascade: false
  })]
};
