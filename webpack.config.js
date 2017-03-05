let path = require('path');
let webpack = require('webpack');
let autoprefixer = require('autoprefixer');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let CompressionPlugin = require('compression-webpack-plugin');
let BrotliPlugin = require('brotli-webpack-plugin');

const isDebug = process.argv.indexOf('-p') < 0;

module.exports = {
  cache: true,
  entry: {
    app: './client/main.js',
    vendor: ['jquery']
  },
  output: {
    path: './server/public/scripts/',
    filename: 'app.min.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"'
    }),
    new ExtractTextPlugin('../styles/[name].min.css'),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.min.js' }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 1024,
      minRatio: 0.9
    }),
    new BrotliPlugin({
      asset: '[path].br[query]',
      test: /\.(js|css|html|svg)$/,
      threshold: 1024,
      minRatio: 0.9
    })
  ],
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        }, {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
            plugins: [autoprefixer({
              browsers: ['last 2 versions', 'ie >= 9', 'ff >= 2'],
              cascade: false
            })]
          }
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            includePaths: [
              path.resolve(__dirname, './node_modules/normalize-scss/sass'),
              path.resolve(__dirname, './node_modules/support-for/sass')
            ]
          }
        }]
      })
    }]
  }
};
