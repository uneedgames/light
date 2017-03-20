<template>
  <div class="app pusher full height">
    <div class="left-part full height">
      <hierarchy :options="options" :tree="tree" :onSelect="onHierarchySelect"/>
    </div>
    <div class="center-part full height">
      <detail v-if="selection" :node="selection" :options="options"/>
      <markdown v-if="!selection && options.readme" :content="options.readme" />
    </div>
  </div>
</template>
<script>
import Hierarchy from './Hierarchy.vue'
import Detail from './Detail.vue'
import Markdown from './Markdown.vue'

export default {
  components: {
    Hierarchy,
    Detail,
    Markdown
  },
  props: {
    options: Object,
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
    width: 240px;
    box-shadow: 1px 0px 2px #dddddd;
    overflow: auto;
    height: 100%;
  }

  > .center-part {
    flex: 1;
    height: 100%;
    overflow: auto;
  }
}
</style>
<style>
.description pre, .markdown pre {
  padding: 1rem;
  background: #f1f1f1;
}

.description pre > code, .markdown pre code {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
}

p > code {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
  background: #dddddd;
  border-radius: 3px;
  display: inline-block;
  padding: 0px 4px;
  color: #333333;
  font-size: 0.8em;
}

img {
  max-width: 100%;
}

.deprecated {
  text-decoration: line-through;
}
</style>