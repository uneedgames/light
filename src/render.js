const path = require('path')
const fse = require('fs-extra')
const webpack  = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpackConfig = require('./webpack.config')

export default function(options, tree) {

  const projectCwd = process.cwd()

  webpackConfig.entry = {
    index: path.resolve(options.theme, 'index.js')
  }
  webpackConfig.output.path = path.resolve(projectCwd, './lightout')
  webpackConfig.plugins.push(new webpack.DefinePlugin({
    DATA: JSON.stringify({
      tree: tree
    })
  }))
  webpackConfig.plugins.push(new HtmlWebpackPlugin({
    title: 'Document',
    template: path.resolve(options.theme, 'index.html'),
    filename: 'index.html'
  }))
  
  const compiler = webpack(webpackConfig)

  if(options.serve) {

    var server = new WebpackDevServer(compiler, Object.assign({
      quiet: false,
      noInfo: false,
      stats: {
        assets: false,
        colors: false,
        version: false,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false
      }
    }))

    server.listen(15063, () => {
      console.log('######################')
      console.log('light serve at :15063')
      console.log('######################')
    })

  } else {

    fse.emptyDirSync(path.resolve(projectCwd, webpackConfig.output.path))

    compiler.run(function(err, stats) {
      if (err) throw err;
      console.log(stats.toString({
        chunks: false,
        colors: true
      }))

      console.log('######################')
      console.log('light complete')
      console.log('######################')
    })

  }

}