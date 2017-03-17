const glob = require('glob')

export default function (pattern, ignore) {
  return new Promise((resolve, reject) => {
    glob(pattern, { ignore: ignore }, (err, files) => {
      if(err) return reject(err)
      resolve(files)
    })
  })
}