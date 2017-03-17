const fs = require('fs');
const fse = require('fs-extra')
const path = require('path')

export default function(name, content) {
  fse.ensureDirSync(path.dirname(name))
  fs.writeFileSync(path.resolve(process.cwd(), name), JSON.stringify(content, null, ' '), 'utf8')
}