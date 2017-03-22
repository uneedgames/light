const fs = require('fs')
const path = require('path')

const defaultOptions = {
  config: 'light.json',
  source: [],
  ignore: [],
  theme: path.resolve(__dirname, '../theme/default'),
  serve: false,
  cwd: '',
  log: true
}

export default function(overrides) {

  let options = merge(cloneDefaults(), overrides)
  
  if(options.config) {
    let configPath = path.resolve(options.cwd || defaultOptions.cwd, options.config)
    if(!fs.existsSync(configPath)) {
      throw new Error('Config file not exists: ' + configPath)
    }
    try {
      let configOpts = JSON.parse(fs.readFileSync(configPath, 'utf8'))
      options = merge(options, configOpts)
    } catch(e) {
      console.error(new Error('Fail to read config file: ' + cnofigPath))
      throw e;
    }
  }

  return options

}

function cloneDefaults() {
  return JSON.parse(JSON.stringify(defaultOptions))
}

function merge(target, overrides) {
  Object.keys(overrides)
    .filter(key => defaultOptions.hasOwnProperty(key))
    .filter(key => void 0 != overrides[key])
    .forEach(key => {
      target[key] = overrides[key]
    })
  return target
}