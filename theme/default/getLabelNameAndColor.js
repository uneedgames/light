export default function(item, isAll) {

  let labels = []

  if(item.isNamespace) {
    labels.push({
      text: 'namespace',
      color: 'blue'
    })
  }
  if(item.isModule) {
    labels.push({
      text: 'module',
      color: 'green'
    })
  }
  if(item.isClass) {
    labels.push({
      text: 'class',
      color: 'red'
    })
  }
  if(item.isDecorator) {
    labels.push({
      text: 'decorator',
      color: 'pink'
    })
  }
  if(item.isConst) {
    labels.push({
      text: 'const',
      color: 'teal'
    })
  }
  if(item.isMethod) {
    labels.push({
      text: 'method',
      color: 'violet'
    })
  }
  if(item.isProperty) {
    labels.push({
      text: 'property',
      color: 'orange'
    })
  }
  if(item.isStatic) {
    labels.push({
      text: 'static',
      color: 'purple'
    })
  }
  if(item.isReadonly) {
    labels.push({
      text: 'readonly',
      color: 'grey'
    })
  }

  if(item.isDeprecated) {
    labels.push({
      text: 'deprecated',
      color: 'black'
    })
  }

  return isAll ? labels : labels[0]
  
}