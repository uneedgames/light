const glob = require('glob')

export default async function (context) {
  let patterns = context.options.source
  let ignore = context.options.ignore
  if(typeof patterns === 'string') {
    patterns = [patterns]
  }
  let result = await Promise.all(patterns.map(pattern => globOne(pattern, ignore)))
  return result.reduce((a, b) => a.concat(b))
}


function globOne(pattern, ignore) {
  return new Promise((resolve, reject) => {
    glob(pattern, { ignore: ignore }, (err, files) => {
      if(err) return reject(err)
      resolve(files)
    })
  })
}