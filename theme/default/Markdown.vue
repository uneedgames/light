<template>
  <div class="markdown" v-if="content">
    <div class="ui container" v-html="markedContent">
    </div>
  </div>
</template>
<script>
import hljs from 'highlight.js'
import marked from 'marked'
import renderer from './MarkedRenderer'

marked.setOptions({
  renderer: renderer,
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  }
})

export default {
  components: {
  },
  props: {
    content: String
  },
  computed: {
    markedContent() {
      return marked(this.content)
    }
  }
}
</script>
<style scoped lang="less">
.markdown {
  width: 100%;
  padding-top: 2rem;
  padding-bottom: 2rem;
}
</style>