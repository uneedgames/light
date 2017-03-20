import Vue from 'vue'
import $ from 'jquery'
import './semantic/semantic.js'

Vue.directive('sticky', {
  inserted: function (el, binding) {
    $(el).sticky({
      context: binding.value ? $(el).closest(binding.value) : null,
      silent: true
    })
  }
})
