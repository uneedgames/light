# light

a javascript document generator

## Usage

```
light -h
```

## Configuration File

Using `light -c [conifg path]` to specify a json file for the configuration

> Default is light.json

```javascript
{
  // page title
  "title": "Foo Document",

  // page icon
  "logo": "logo.png",

  // specify source files or patterns 
  "source": [
    "src/**/*.js"
  ],

  // specify what files or patterns is ignored
  "ignore": [ 
    "src/someIngored.js"
  ],

  // specify images folder
  "images": "images", 
}
```

## Comment Tags

### @class

```javascript
/**
 *  here is class description 
 *
 *  @class
 */
class Foo {}
```

### @property

```javascript
/**
 *  here is property description 
 *  @property {boolean} isDebug
 */
var isDebug = true

class Foo {
  /**
   *  here is property description 
   *  @property {boolean} bar
   */
  get bar() { }

  constructor() {

    /**
     *  here is property description 
     *  @property {Number} prop
     */
    this.prop = 1
  }
}
```

### @method

```javascript
/**
 *  here is method description 
 *  @method
 *  @return {boolean} get a boolean value
 */
function foo() {
  return true
}

// it also can be comment on a class method
```

### @module

```javascript
/**
 * here is module description
 *
 * @module yourModule
 */
export default yourModule

```

### @namespace

```javascript
const myNamespace = {}
/**
 * here is module description
 *
 * @namespace foo.bar
 */
export default myNamespace
```

## Other Tags

* **@readonly**  for property
* **@static**    for property and method
* **@param**     for method arguments
* **@return**    for method returns
* **@const**     for a const property
* **@memberof**  specify what is's belong to

## Road Map

* Article support
* Tests
* `light -s` for watch files changed

## Changelogs

* Improve code
* Theme support

### MIT License


