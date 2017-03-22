const fs = require('fs')
const path = require('path')
const acorn = require('acorn')
const babylon = require('babylon')
const estraverse = require('estraverse')
import * as T from 'babel-types'
import traverse from 'babel-traverse'
import Comment from './Comment'


/**
 * scan comments from the giving files
 * @param {*} options 
 */
export default async function(context, files, onProgress) {
  let progress = 0
  let result = []
  for(let i=0; i<files.length; i++) {
    let file = files[i]
    onProgress && onProgress(++progress, file)
    let item = await parseFile(file)
    result.push(item)
  }
  return result
}

function parseFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, content) => {
      if(err) return reject(err)

      // parse AST
      var ast = babylon.parse(content.toString('utf8'), {
        sourceType: 'module',
        ranges: true,
        plugins: [
          'decorators',
          'asyncGenerators'
        ]
      })

      var comments = ast.program.comments || []
      var resolvedComments = []

      // traverse nodes those has leadingComments
      traverse(ast, {
        enter: (path) => {
          let node = path.node
          let comments = node.leadingComments || []
          if(comments.length <= 0) return

          let commentRaw = node.leadingComments[node.leadingComments.length-1]
          if(commentRaw.type !== 'CommentBlock') return

          let comment = new Comment(commentRaw)
          try {
            // fill some unspecify information such as name of method/class/property ...
            resolveNodeComment(node, comment)
          } catch(e) {
            console.error(e)
          }
          resolvedComments.push(comment)
        }
      })


      resolve({
        file: file,
        source: content.toString('utf8'),
        comments: resolvedComments
      })

    })
  })
}

function resolveNodeComment(node, comment) {
  if(T.isClassMethod(node)) {
    switch (node.kind) {
      case 'method':
        comment.setTagPropertyIfHasn('method', 'name', node.key.name)
        break
      case 'get':
      case 'set':
        comment.setTagPropertyIfHasn('property', 'name', node.key.name)
        break
      case 'constructor':
        comment.setTagPropertyIfHasn('method', 'name', 'constructor')
        break
    }
  }
  else if(T.isExportDefaultDeclaration(node) || T.isExportNamedDeclaration(node)) {
    switch (node.declaration.type) {
      case 'ClassDeclaration':
        comment.setTagPropertyIfHasn('class', 'name', node.declaration.id.name);
        break
      case 'FunctionDeclaration':
        if(node.declaration && node.declaration.id) {
          comment.setTagPropertyIfHasn('method', 'name', node.declaration.id.name);
        }
        break
    }
  } else if(T.isObjectProperty(node)) {
    comment.setTagPropertyIfHasn('property', 'name', node.key.name)
  } else if(T.isFunctionDeclaration(node)) {
    comment.setTagPropertyIfHasn('method', 'name', node.id.name)
  } else if(T.isVariableDeclaration(node)) {
    comment.setTagPropertyIfHasn('property', 'name', node.declarations[0].id.name)
  } else if(T.isExpressionStatement(node)) {
    if(T.isAssignmentExpression(node.expression)) {
      if(T.isFunctionExpression(node.expression.right)) {
        let left = node.expression.left
        if(T.isMemberExpression(left)) {
          comment.setTagPropertyIfHasn('method', 'name', left.property.name)
        }
      } else {
        let left = node.expression.left
        if(T.isMemberExpression(left)) {
          comment.setTagPropertyIfHasn('property', 'name', left.property.name)
        }
      }
    }
  } else if(T.isClassDeclaration(node)) {
    comment.setTagPropertyIfHasn('class', 'name', node.id.name);
  }
}