<template>
  <div class="app">
    <div class="left-part">
      <hierarchy :tree="tree" :onSelect="onHierarchySelect"/>
    </div>
    <div class="center-part">
      <detail :node="selection"/>
    </div>
  </div>
</template>
<script>
import Hierarchy from './Hierarchy.vue'
import Detail from './Detail.vue'

export default {
  components: {
    Hierarchy,
    Detail
  },
  props: {
    tree: Array,
  },

  data() {
    return {
      selection: null
    }
  },

  methods: {
    onHierarchySelect(node) {
      this.selection = node
    }
  }

}
</script>
<style scoped lang="less">

.app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;

  > .left-part {
    width: 300px;
    min-width: 300px;
    box-shadow: 1px 0px 2px #dddddd;
    overflow: auto;
  }

  > .center-part {
    flex: 1;
    height: 100%;
  }
}

</style>
<style lang="less">
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
}


.label {
  &.namespace {
    background: #1e88e5;
  }

  &.module {
    background: #026e00;
  }

  &.class {
    background: #b71c1c;
  }

  &.const {
    background: #5e35b1;
  }

  &.method {
    background: #0d47a1;
  }

  &.property {
    background: #00695c;
  }

  &.static {
    background: #1a237e;
  }

  &.readonly {
    background: #00bfa5;
  }

}
</style>