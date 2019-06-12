import autoprefixer from 'autoprefixer';
import BrotliPlugin from 'brotli-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';

export default {
  cache: true,
  entry: {
    app: './client/main.js',
    vendor: ['jquery', 'socket.io-client']
  },
  output: {
    path: path.resolve(__dirname, './server/public/scripts/'),
    filename: '[name].min.js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '../styles/[name].min.css',
      chunkFilename: '[id].css'
    }),
    new CompressionPlugin({
      filename: '[path].gz[query]',
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
      use: [{
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: process.env.NODE_ENV === 'development'
        }
      }, {
        loader: 'css-loader',
        options: {
          sourceMap: true
        }
      }, {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          plugins: () => [autoprefixer({
            cascade: false
          })]
        }
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
          includePaths: [
            path.resolve(__dirname, './node_modules/normalize-scss/sass'),
            path.resolve(__dirname, './node_modules/support-for/sass'),
            path.resolve(__dirname, './client/sass')
          ]
        }
      }]
    }]
  }
};
