<template>
  <div class="hierarchy">
    <tree v-for="(subtree,idx) in trimedTree" :key="idx" treeId="hierarchy" :tree="subtree" :onSelect="onTreeSelect"/> 
  </div>
</template>
<script>
import Tree from './Tree.vue'

export default {
  components: { Tree },
  props: {
    tree: Array
  },
  computed: {
    trimedTree() {
      let kinds = [
        'class',
        'namespace'
      ]
      return this.tree.filter((item) => {
        // return kinds.indexOf(item.kind) !== -1
        return true
      })
    }
  },

  methods: {
    onTreeSelect(tree) {  
      console.log(tree)
    }
  }
}
</script>
<style>
</style>