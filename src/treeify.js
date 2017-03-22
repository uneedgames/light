const fs = require('fs')
const path = require('path')

export default function(context, parsedResult) {
  return memberify(parsedResult)
}

function memberify(parsedResult) {
  let tree = {}

  let comments = []
  parsedResult.forEach(result => {
    let fileTree = treeifyFile(result)
    comments = comments.concat(fileTree.comments)
  })

  whileUntilNotChanges(comments, comment => {
    let memberof = comment.getMemberof()
    if(!memberof) {
      tree[comment.getName()] = comment
      comments.splice(comments.indexOf(comment), 1)
    } else {
      let owner = tree
      if(!tree[memberof] && memberof.indexOf('.') !== 1) {
        let path = memberof.split('.')
        owner = { childMap: tree }
        for(let i=0; i<path.length; i++) {
          owner = owner.childMap[path[i]]
          if(!owner) break
        }
      } else {
        owner = tree[memberof]
      }
      if(owner) {
        owner.addChild(comment)
        comments.splice(comments.indexOf(comment), 1)
      }
    }
  })

  let pathStack = []

  function traverseBuildPath(comment) {
    pathStack.push(comment.getName())
    comment.path = pathStack.join('.')
    comment.children.forEach(traverseBuildPath)
    pathStack.pop()
  }
  for(var key in tree) {
    let root = tree[key]
    traverseBuildPath(root)
  }

  function trimChildMap(tree) {
    delete tree.childMap
    tree.children.forEach(trimChildMap)
    return tree
  }

  return Object.keys(tree).map(key => trimChildMap(tree[key]))
}

function treeifyFile(result) {
  let tree = {}
  let scope
  let comments = result.comments
  whileUntilNotChanges(comments, comment => {
    if(comment.is('namespace')) {
      return
    }
    let owner = scope
    let memberof = comment.getMemberof()
    if(memberof) {
      owner = tree[memberof]
    }

    if(owner) {
      owner.addChild(comment)
      comments.splice(comments.indexOf(comment), 1)
    }

    if(comment.isScope()) {
      scope = comment
      tree[scope.getName()] = scope
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

