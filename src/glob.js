const glob = require('glob')

export default function (pattern) {
  return new Promise((resolve, reject) => {
    glob(pattern, (err, files) => {
      if(err) return reject(err)
      resolve(files)
    })
  })
}