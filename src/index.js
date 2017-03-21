const fs = require('fs')
const path = require('path')
const program = require('commander')

import glob from './glob'
import parse from './parse'
import treeify from './treeify'
import render from './render'
import progress from './progress'


program
  .version('0.1.0')
  .option('-c, --config [config]', 'Specify config file path, default is light.json')
  .option('-s, --serve', 'Setup a server to serve generated document')
  .parse(process.argv);

const options = {
  config: 'light.json',
  ignore: [],
  theme: path.resolve(__dirname, '../theme/default'),
  serve: program.serve
}

Object.assign(options, JSON.parse(fs.readFileSync(path.resolve(process.cwd(), program.config || options.config))))

async function main() {
  try {

    console.log('light start')

    progress.step('glob', options.source.length)
    let files = []
    for(let i=0; i<options.source.length; i++) {
      progress.task(options.source[i])
      files = files.concat(await glob(options.source[i], options.ignore))
    }
    progress.done(`got ${files.length} files.`)
    if(files.length <= 0) return

    progress.step('parse', files.length)
    let result = await parse(files, (_, file) => {
      progress.task(file)
    })
    progress.done('done')

    progress.step('treeify', 1)
    progress.task('doing')
    let tree = treeify(result)
    progress.done('done')

    progress.step('render', 1)
    progress.task('doing')
    await render(options, tree)
    progress.done('done')

  } catch(e) {
    console.error(e)
  }
}

main()