const parseComment = require('comment-parser')

export default class Comment {

  constructor(raw) {
    this.raw = JSON.parse(JSON.stringify(raw))
    this.parsed = parseComment("/*" + raw.value + "*/")[0] || { tags: [] }

    this.path = null
    this.children = []
    this.childMap = {}
  }

  addChild(comment) {
    this.children.push(comment)
  }

  is(tag) {
    return !!this.getTag(tag)
  }

  isScope() {
    return this.is('namespace') || this.is('module') || this.is('class')
  }

  getMemberof() {
    return this.getTagProperty('memberof', 'name')
  }

  getType() {
    let type
    if(this.is('const')) {
      type = this.getTagProperty('const', 'type')
    } else if(this.is('property')) {
      type = this.getTagProperty('property', 'type')
    } else if(this.is('method')) {
      type = this.getTagProperty('return', 'type')
    }
    return type
  }

  getName() {
    let name
    let scopeKey = this.getScopeKey()
    if(scopeKey) {
      name = scopeKey
    }
    if(this.getTag('method')) {
      name = this.getTagProperty('method', 'name')
    } else if(this.getTag('const')) {
      name = this.getTagProperty('const', 'name')
    } else if(this.getTag('property')) {
      name = this.getTagProperty('property', 'name')
    } else if(this.getTag('constructor')) {
      name = this.getTagProperty('constructor', 'name') || 'constructor'
    }
    return name
  }

  getDescription() {
    return this.parsed.description || ''
  }

  getScopeKey() {
    let namespace = this.getTagProperty('namespace', 'name')
    let module = this.getTagProperty('module', 'name')
    let clazz = this.getTagProperty('class', 'name')
    let key = namespace || module || clazz
    return key
  }

  addTagIfHasn(tagName, name) {
    if(!this.getTag(tagName)) {
      this.parsed.tags.push({
        tag: tagName,
        name: name
      })
    }
  }

  setTagPropertyIfHasn(tagName, propName, value) {
    let tag = this.getTag(tagName)
    if(tag) {
      let val = tag[propName]
      if(!val) {
        tag[propName] = value
      }
    } else {
      this.addTagIfHasn(tagName, null)
      this.setTagPropertyIfHasn(tagName, propName, value)
    }
  }

  getTag(tagName) {
    return this.parsed.tags.filter(tag => tag.tag === tagName)[0]
  }

  getTagProperty(tagName, propName) {
    let tag = this.getTag(tagName)
    if(tag) {
      return tag[propName]
    }
  }

}