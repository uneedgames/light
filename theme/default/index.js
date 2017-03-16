import 'font-awesome/css/font-awesome.css'
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