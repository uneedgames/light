const fs = require('fs')
const path = require('path')
const acorn = require('acorn')
const babylon = require('babylon')
const estraverse = require('estraverse')
const parseComment = require('comment-parser')


import * as T from 'babel-types'
import traverse from 'babel-traverse'

/**
 * scan comments from the giving files
 * @param {*} options 
 */
export default async function(files, onProgress) {
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
      var newComments = []

      traverse(ast, {
        enter: (path) => {
          let node = path.node
          let comments = node.leadingComments || []
          if(comments.length <= 0) return

          let comment = node.leadingComments[node.leadingComments.length-1]

          if(comment.type !== 'CommentBlock') return
          comment.parsed = parseComment("/*" + comment.value + "*/")[0] || {
            tags: []
          }
          if(comment.parsed && comment.parsed.tags) {
            if(Array.prototype.toString(comment.parsed.tags) !== '[object Array]') {
              comment.parsed.tags = Object.keys(comment.parsed.tags).map(key => comment.parsed.tags[key])
            }
          } else {
            comment.parsed = {
              tags: []
            }
          }
          try {
            resolveNodeComment(node, comment)
          } catch(e) {
            console.log(node)
            console.warn(e.message)
          }

          newComments.push(JSON.parse(JSON.stringify(comment)))
        }
      })


      resolve({
        file: file,
        source: content.toString('utf8'),
        comments: newComments
      })

    })
  })
}

function resolveNodeComment(node, comment) {
  if(T.isClassMethod(node)) {
    switch (node.kind) {
      case 'method':
        fillNameToTag(comment, 'method', node.key.name);
        break
      case 'get':
      case 'set':
        fillNameToTag(comment, 'property', node.key.name);
        break
      case 'constructor':
        fillNameToTag(comment, 'method', 'constructor');
        break
    }
  }
  else if(T.isExportDefaultDeclaration(node) || T.isExportNamedDeclaration(node)) {
    switch (node.declaration.type) {
      case 'ClassDeclaration':
        fillNameToTag(comment, 'class', node.declaration.id.name);
        break
      case 'FunctionDeclaration':
        if(node.declaration && node.declaration.id) {
          fillNameToTag(comment, 'method', node.declaration.id.name);
        }
        break
    }
  } else if(T.isObjectProperty(node)) {
    fillNameToTag(comment, 'property', node.key.name)
  } else if(T.isFunctionDeclaration(node)) {
    fillNameToTag(comment, 'method', node.id.name)
  } else if(T.isVariableDeclaration(node)) {
    fillNameToTag(comment, 'property', node.declarations[0].id)
  } else if(T.isExpressionStatement(node)) {
    if(T.isAssignmentExpression(node.expression)) {
      if(T.isFunctionExpression(node.expression.right)) {
        let left = node.expression.left
        if(T.isMemberExpression(left)) {
          fillNameToTag(comment, 'method', left.property.name)
        }
      } else {
        let left = node.expression.left
        if(T.isMemberExpression(left)) {
          fillNameToTag(comment, 'property', left.property.name)
        }
      }
    }
  } else if(T.isClassDeclaration(node)) {
    fillNameToTag(comment, 'class', node.id.name);
  } else {
    console.log(node)
    process.exit(-1)
  }
}

function scopeKey(comment) {
  let namespace = getTagProperty(comment, 'namespace', 'name')
  let module = getTagProperty(comment, 'module', 'name')
  let clazz = getTagProperty(comment, 'class', 'name')
  let key = namespace || module || clazz
  return key
}

function fillNameToTag(comment, tagName, name) {
  let tag = getTag(comment, tagName)
  if(!tag) {
    addTag(comment, tagName, name)
  } else {
    tag.name = tag.name || name
  }
}

function getTag(comment, tagName) {
  if(comment.parsed.tags && comment.parsed.tags.length > 0) {
    return comment.parsed.tags.filter(tag => tag.tag === tagName)[0]
  }
}

function addTag(comment, tag, name) {
  let tags = comment.parsed.tags = comment.parsed.tags || []
  tags.push({
    "tag": tag,
    "name": name,
  })
}

function getTagProperty(comment, tagName, attr) {
  let tag = comment.parsed.tags.filter(tag => {
    return tag.tag === tagName
  })[0]
  if(!tag) return
  return tag[attr]
}