const fs = require('fs')
const path = require('path')
const acorn = require('acorn')
const estraverse = require('estraverse')
const parseComment = require('comment-parser')

import write from './write'

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

      // parse comments
      comments = comments.filter(comment => {
        return comment.type !== 'Line'
      }).map(comment => {
        comment.parsed = parseComment("/*" + comment.value + "*/")[0] || {
          tags: []
        }
        return comment
      })

      estraverse.attachComments(ast, comments, tokens)

      let newComments = []

      estraverse.traverse(ast, {
        enter: (node) => {
          if(node.leadingComments && node.leadingComments.length > 0) {

            let comment = node.leadingComments[node.leadingComments.length-1]

            // maybe attach comments change tags array to a json object
            if(comment.parsed && comment.parsed.tags) {
              if(Array.prototype.toString(comment.parsed.tags) !== '[object Array]') {
                comment.parsed.tags = Object.keys(comment.parsed.tags).map(key => comment.parsed.tags[key])
              }
            } else {
              comment.parsed = {
                tags: []
              }
            }

            if (node.type === 'MethodDefinition') {
              switch (node.kind) {
                case 'method':
                  fillNameToTag(comment, 'method', node.key.name);
                  break
                case 'get':
                case 'set':
                  fillNameToTag(comment, 'property', node.key.name);
                  break
                case 'constructor':
                  // TODO
                  break
              }
            } else if (node.type === 'ExportNamedDeclaration' || node.type === 'ExportDefaultDeclaration') {
              switch (node.declaration.type) {
                case 'ClassDeclaration':
                  fillNameToTag(comment, 'class', node.declaration.id.name);
                  break
                case 'FunctionDeclaration':
                  fillNameToTag(comment, 'method', node.declaration.id.name);
                  break
              }
            } else if(node.type === 'Property') {
              fillNameToTag(comment, 'property', node.key.name)
            } else if(node.type === 'FunctionDeclaration') {
              fillNameToTag(comment, 'method', node.id.name)
            } else if(node.type === 'VariableDeclaration') {
              // TODO
            } else if(node.type === 'ExpressionStatement') {
              // TODO
            }
            
            newComments.push(JSON.parse(JSON.stringify(comment)))
          }
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