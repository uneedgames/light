export default function(children) {
  return children.slice().sort((a, b) => value(a) - value(b))
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
    if(test.isProperty) {
      return 100
    }
    if(test.isMethod) {
      return 200
    } else {
      return 300
    }
  }
  
  if(test.isProperty) {
    return 400
  }
  if(test.isMethod) {
    return 500
  }
  return 600
}