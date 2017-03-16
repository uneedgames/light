var path = require('path')
var webpack = require('webpack')

module.exports = {
  output: {
    filename: '[name].js',
  },
  node: {
    fs: "empty"
  },
  resolve: {
    modules: [path.resolve(__dirname, '../node_modules')],
  },
  resolveLoader: {
    modules: [path.resolve(__dirname, '../node_modules')],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
  			exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0', 'stage-3'],
          plugins: ["transform-decorators-legacy"]
        }
      },
      {
        test: /\.vue$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'file-loader',
        query: {
          name: 'images/[name].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        query: {
          name: 'fonts/[name].[ext]'
        }
      }
    ]
  },
  plugins: [
  ]
};
