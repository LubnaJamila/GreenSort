const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, '../src/main.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist'), // Ubah ke path absolut
    publicPath: '/', // Tambahkan ini
    clean: true,
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['@popperjs/core', 'default']
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/pages/index.html'),
      filename: 'index.html',
      chunks: ['main'] // Sesuaikan dengan entry point
    }),
    // Tambahkan untuk halaman lain
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/pages/login.html'),
      filename: 'login.html',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/pages/register.html'),
      filename: 'register.html',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/pages/dashboard.html'),
      filename: 'dashboard.html',
      chunks: ['main']
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[hash][ext][query]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[hash][ext][query]'
        }
      }
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
};