import 'font-awesome/css/font-awesome.css'
import 'jquery'
import './semantic/semantic.css'
import './semantic/semantic.js'
import 'highlight.js/styles/default.css'

import './directive'

import Vue from 'vue'
import App from './App.vue'

new Vue({
  el: '#app',
  data() {
    return DATA
  },
  render(createElement) {
    return createElement(App, {
      props: {
        options: this.options,
        tree: this.tree,
      }
    })
  }
})