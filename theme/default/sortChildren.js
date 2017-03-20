export default function(children) {
  return children.slice().sort((a, b) => {
    let v = value(a) - value(b)
    if(v === 0) {
      let sorted = [a, b].sort((a, b) => {
        if(a.group === b.group) return 0
        if(a.group && !b.group) return -1
        if(!a.group && b.group) return 1
      })
      return sorted.indexOf(a) - sorted.indexOf(b)
    }
    return v
  })
}

function value(test) {
  if(test.isConst) {
    return 1
  }
  if(test.isNamespace) {
    return 30
  }
  if(test.isModule) {
    return 40
  }
  if(test.isStatic) {

    if(test.isDecorator) {
      return 80
    }

    if(test.isProperty) {
      return 100
    }
    if(test.isMethod) {
      return 200
    } else {
      return 300
    }
  }

  if(test.isDecorator) {
    return 350
  }
  
  if(test.isProperty) {
    return 400
  }
  if(test.isMethod) {
    return 500
  }
  return 600
}