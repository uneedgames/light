const path = require('path')
const fse = require('fs-extra')
const webpack  = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

export default function(context, tree) {

  let options = context.options
  let themePath = context.options.theme
  if(!path.isAbsolute(themePath)) {
    themePath = path.resolve(context.workspace, themePath)
  }

  let themeConfig = {
    type: "webpack",
    render: "render.js",
    config: 'webpack.config.js',
    data: 'json'
  }

  // scan theme.json
  let themeJSONPath = path.resolve(themePath, 'theme.json')
  if(fse.existsSync(themeJSONPath)) {
    themeConfig = fse.readJSONSync(themeJSONPath)
    if(!themeConfig.type) {
      throw new Error('theme.json should configure type property, such as webpack or normal')
    }
  }

  if(themeConfig.data === 'json') {
    tree = tree2JSON(tree)
  }

  if(themeConfig.type === 'normal') {
    let renderModulePath = path.resolve(themePath, themeConfig.render)
    if(!fse.existsSync(renderModulePath)) {
      throw new Error('Can not find render module: ' + themeConfig.render)
    }

    const render = require(renderModulePath)
    render(context, tree, themeConfig)

  } else if(themeConfig.type === 'webpack') {

    let webpackConfigPath = path.resolve(themePath, themeConfig.config)
    if(!fse.existsSync(webpackConfigPath)) {
      throw new Error('Fail to read webpack config file: ' + themeConfig.config)
    }

    let webpackConfig = require(webpackConfigPath)
    if(typeof webpackConfig === 'function') {
      webpackConfig = webpackConfig(context)
    }
    webpackRender(context, tree, themeConfig, webpackConfig)

  } else {
    throw new Error('Unknow theme type: ' + themeConfig.type)
  }

}

function tree2JSON(tree, children) {
  return (children || tree).map(comment => {
    let params
    if(comment.is('method')) {
      params = comment.parsed.tags.filter(tag => tag.tag === 'param')
    }
    return {
      name: comment.getName(), 
      path: comment.path,
      group: comment.getTagProperty('group', 'name'),
      extend: comment.getTagProperty('extends', 'name'),
      isScope: comment.isScope(),
      isClass: comment.is('class'),
      isModule: comment.is('module'),
      isNamespace: comment.is('namespace'),
      isMethod: comment.is('method'),
      isProperty: comment.is('property'),
      isConstructor: comment.is('constructor'),
      isDecorator: comment.is('decorator'),
      isConst: comment.is('const'),
      isStatic: comment.is('static'),
      isReadonly: comment.is('readonly'),
      isDeprecated: comment.is('deprecated'),
      memberof: comment.getMemberof(),
      type: comment.getType(),
      params: params,
      description: comment.getDescription(),
      children: tree2JSON(comment, comment.children)
    }
  })
}

function webpackRender(context, tree, themeConfig, webpackConfig) {
  
  let options = context.options

  webpackConfig.output.path = path.resolve(context.workspace, webpackConfig.output.path)

  // copy logo
  if(options.logo) {
    webpackConfig.plugins.push(new CopyWebpackPlugin([{
      from: path.resolve(context.workspace, options.logo),
      to: webpackConfig.output.path
    }]))
    options.logo = path.basename(options.logo)
  }


  // readme
  if(fse.existsSync(path.resolve(context.workspace, 'readme.md'))) {
    options.readme = fse.readFileSync(path.resolve(context.workspace, 'readme.md'), 'utf8')
  }

  // copy images
  if(options.images) {
    webpackConfig.plugins.push(new CopyWebpackPlugin([{
      from: path.resolve(context.workspace, options.images),
      to: path.resolve(webpackConfig.output.path, options.images)
    }]))
  }

  // pass data to theme project
  webpackConfig.plugins.push(new webpack.DefinePlugin({
    LIGHT_DATA: JSON.stringify({
      options: options,
      tree: tree
    })
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

    fse.emptyDirSync(path.resolve(context.worksapce, webpackConfig.output.path))

    return new Promise((resolve, reject) => {
      compiler.run(function(err, stats) {
        if (err) return reject(err);
        if(stats.hasErrors()) {
          return reject(new Error(stats.toString({
            colors: true
          })))
        }
        resolve()
      })
    })
    

  }
}