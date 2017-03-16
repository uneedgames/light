<template>
  <div class="app">
    <hierarchy :tree="tree" />
  </div>
</template>
<script>
import Hierarchy from './Hierarchy.vue'

export default {
  components: {
    Hierarchy
  },
  props: {
    tree: Array
  },

}
</script>
<style>
</style>