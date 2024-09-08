const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/bot.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bot.bundle.js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: '' }, // Copy static assets
        { from: 'src/worker.js', to: '' }, // Copy worker.js to the dist directory
      ],
    }),
  ],
};
