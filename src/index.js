const fs = require('fs')
const path = require('path')

import Context from './Context'
import options from './options'
import glob from './glob'
import parse from './parse'
import treeify from './treeify'
import render from './render'
import logger from './logger'

export default async function(opts, callback) {
  const context = new Context(options(opts))
  await light(context)
  callback && callback()
}

async function light(context) {
  try {
    let opts = context.options
    logger.setLog(opts.log)

    logger.step('glob', opts.source.length)
    let files = await glob(context)
    logger.done(`got ${files.length} files.`)
    
    if(files.length <= 0) return

    logger.step('parse', files.length)
    let result = await parse(context, files, (_, file) => {
      logger.task(file)
    })
    logger.done('done')

    logger.step('treeify', 1)
    let tree = treeify(context, result)
    logger.done('done')

    logger.step('render', 1)
    logger.task('doing')
    await render(context, tree)
    logger.done('done')

  } catch(e) {
    console.error(e)
  }
}