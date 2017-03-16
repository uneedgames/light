const documentation = require('documentation')
const fs = require('fs')
const path = require('path')
const acorn = require('acorn')
const parseComment = require('comment-parser')

/**
 * scan comments from the giving files
 * @param {*} options 
 */
export default async function(files, onProgress) {
  let progress = 0
  let result = []
  for(let i=0; i<files.length; i++) {
    let file = files[i]
    let item = await parseFile(file)
    result.push(item)
    onProgress && onProgress(++progress, file)
  }
  return result
}

function parseFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, content) => {
      if(err) return reject(err)

      // parse AST
      var comments = []
      var tokens = []
      var ast = acorn.parse(content, {
        sourceType: 'module',
        ranges: true,
        onComment: comments,
        onToken: tokens
      })

      ast = filterAST(ast)

      // parse comments
      comments.forEach(comment => {
        comment.parsed = parseComment("/*" + comment.value + "*/")[0]
      })

      resolve({
        file: file,
        source: content,
        ast: ast,
        comments: comments,
      })

    })
  })
}

function filterAST(ast) {

  return ast
}