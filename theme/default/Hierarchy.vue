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
    tree: Array,
    onSelect: Function
  },
  computed: {
    trimedTree() {
      return this.tree.map(subtree => {
        subtree.toggle = true
        return subtree
      })
    }
  },

  methods: {
    onTreeSelect(node) { 
      this.onSelect(node.tree)
    }
  }
}
</script>
<style>
</style>