const path = require('path');
const webpack = require('webpack');
require('dotenv').config(); // Load .env file variables into process.env

module.exports = {
  entry: './src/bot.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bot.bundle.js',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.GITHUB_TOKEN': JSON.stringify(process.env.GITHUB_TOKEN),
      'process.env.REPO_URL': JSON.stringify(process.env.REPO_URL),
    }),
  ],
  resolve: {
    fallback: {
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
      crypto: require.resolve('crypto-browserify'),
      vm: require.resolve('vm-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
    },
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    compress: true,
    port: 3000,
  },
};
