import autoprefixer from 'autoprefixer';
import BrotliPlugin from 'brotli-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import path from 'path';
import webpack from 'webpack';

const IS_DEBUG = process.argv.indexOf('-p') < 0;

export default {
  cache: true,
  entry: {
    app: './client/main.js',
    vendor: ['jquery', 'socket.io-client']
  },
  output: {
    path: './server/public/scripts/',
    filename: 'app.min.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': IS_DEBUG ? '"development"' : '"production"'
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
            plugins: () => [autoprefixer({
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
