const fs = require('fs')
const path = require('path')
const program = require('commander')

import glob from './glob'
import parse from './parse'
import resolve from './resolve'
import render from './render'

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
  let files = []
  for(let i=0; i<options.source.length; i++) {
    files = files.concat(await glob(options.source[i], options.ignore))
  }
  let astMap = await parse(files)
  let tree = resolve(astMap)
  // await render(options, tree)
}

main()