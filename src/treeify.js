const fs = require('fs')
const path = require('path')


import write from './write'

export default function(parsedResult) {
  return memberify(parsedResult)
}


function memberify(parsedResult) {
  let tree = {}

  let comments = []
  parsedResult.forEach(result => {
    let fileTree = treeifyFile(result)
    comments = comments.concat(fileTree.comments)
  })

  whileUntilNotChanges(comments, item => {
    if(!item.memberof) {
      tree[item.name] = item
    } else {
      let owner = tree
      let memberof = item.memberof
      if(memberof.indexOf('.') !== 1) {
        let path = memberof.split('.')
        owner = {
          childMap: tree
        }
        for(let i=0; i<path.length; i++) {
          owner = owner.childMap[path[i]]
          if(!owner) break
        }
      } else {
        owner = tree[memberof]
      }
      if(owner) {
        owner.children.push(item)
        comments.splice(comments.indexOf(item), 1)
      }
    }
  })

  let pathStack = []

  function traverseBuildPath(item) {
    pathStack.push(item.name)
    item.path = pathStack.join('.')
    item.children.forEach(traverseBuildPath)
    pathStack.pop()
  }
  for(var key in tree) {
    let root = tree[key]
    traverseBuildPath(root)
  }

  return Object.keys(tree).map(key => tree[key])
}

function treeifyFile(result) {
  let tree = {}
  let comments = result.comments.slice().map(comment => {
    let namespace = getTagProperty(comment, 'namespace', 'name')
    let module = getTagProperty(comment, 'module', 'name')
    let clazz = getTagProperty(comment, 'class', 'name')
    let memberof = getTagProperty(comment, 'memberof', 'name')
    let scopeKey = namespace || module || clazz
    let method = getTagProperty(comment, 'method', 'name')
    let property = getTagProperty(comment, 'property', 'name')
    let isConst = !!getTag(comment, 'const')
    let isStatic = !!getTag(comment, 'static')
    let isConstructor = !!getTag(comment, 'constructor')
    let isReadonly = !!getTag(comment, 'readonly')
    let name = scopeKey || method || property
    if(isConstructor) {
      name = name || 'constructor'
    }

    let type
    let params
    if(isConst) {
      type = getTagProperty(comment, 'const', 'type')
    } else if(!!property) {
      type = getTagProperty(comment, 'property', 'type')
    } else if(!!method) {
      type = getTagProperty(comment, 'return', 'type')
      params = comment.parsed.tags.filter(tag => tag.tag === 'param')
    }

    let see = getTag(comment, 'see')
    let example = getTag(comment, 'example')
    
    let item = { 
      name: name, 
      isScope: !!scopeKey,
      isClass: !!clazz,
      isModule: !!module,
      isNamespace: !!namespace,
      isMethod: !!method,
      isProperty: !!property,
      isConstructor: isConstructor,
      isConst: isConst,
      isStatic: isStatic,
      isReadonly: isReadonly,
      comment: comment,
      memberof: memberof,
      type: type,
      params: params,
      description: comment.parsed.description || '',
      see: see,
      example: example,
      children: [],
      childMap: {}
    }

    return item
  })

  let scope
  whileUntilNotChanges(comments, item => {
    let hasOwner = false
    let owner = scope
    if(item.memberof) {
      owner = tree[item.memberof]
    }

    if(owner) {
      owner.children.push(item)
      owner.childMap[item.name] = item
      comments.splice(comments.indexOf(item), 1)
    }

    if(item.isScope) {
      scope = item
      tree[scope.name] = scope
    }
  })

  tree.comments = comments

  return tree
}

function whileUntilNotChanges(arr, func) {
  let len = arr.length
  while(true) {
    arr.slice().forEach(func)
    if(len !== arr.length) {
      len = arr.length
    } else {
      break
    }
  }
}

function getTag(comment, tagName) {
  if(comment.parsed.tags && comment.parsed.tags.length > 0) {
    return comment.parsed.tags.filter(tag => tag.tag === tagName)[0]
  }
}

function getTagProperty(comment, tagName, attr) {
  let tag = comment.parsed.tags.filter(tag => {
    return tag.tag === tagName
  })[0]
  if(!tag) return
  return tag[attr]
}

