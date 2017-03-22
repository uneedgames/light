const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = function(context) {
  console.log(__dirname)
  return {
    context: __dirname,
    entry: {
      index: __dirname + '/index.js',
      vendor: ['vue', 'jquery', 'highlight.js']
    },
    output: {
      path: 'lightout',
      filename: '[name].js',
    },
    node: {
      fs: "empty"
    },
    resolve: {
      modules: [path.resolve(__dirname, './node_modules')],
    },
    resolveLoader: {
      modules: [path.resolve(__dirname, './node_modules')],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          options: {
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
          options: {
            name: 'images/[name].[ext]'
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]'
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: context.options.title,
        template: 'index.html',
        filename: 'index.html'
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",
        minChunks: Infinity,
      })
    ]
  }
}
