import 'font-awesome/css/font-awesome.css'
import 'materialize-css/dist/css/materialize.css'
import 'materialize-css/dist/js/materialize.js'
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
        tree: this.tree
      }
    })
  }
})