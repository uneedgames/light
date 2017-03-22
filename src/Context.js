const path = require('path')

export default class Context {

  get workspace() {
    let cwd = this.options.cwd
    if(cwd) {
      if(path.isAbsolute(cwd)) {
        return cwd
      } else {
        return path.resolve(process.cwd(), cwd)
      }
    } else {
      return process.cwd()
    }
  }

  constructor(options) {
    this.options = options
  }

}