const program = require('commander')

import light from './index'

program
  .version('0.1.0')
  .option('-c, --config [config]', 'Specify config file path, default is light.json')
  .option('-s, --serve', 'Setup a server to serve generated document')
  .option('-t, --theme [theme]', 'Sepecify theme path')
  .option('-d, --disable-log', 'Specify whether output message')
  .parse(process.argv);


light({
  config: program.config,
  theme: program.theme,
  serve: program.serve,
  log: !program['disable-log']
})
