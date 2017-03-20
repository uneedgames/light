<template>
  <div class="detail-methods">
    <h2 class="ui header">{{title}}</h2>
    <div class="method" v-for="method in methods">
      <h4 class="ui header">
        <a class="anchor" :id="getAnchor(method)"></a>
        <b>{{(method.isDecorator ? '@' : '') + method.name}}</b>(<span v-html="getMethodArgs(method)"></span>):<b style="color: brown;">{{method.type || 'void'}}</b>
        </h4>
      <p class="description" v-html="method.description"></p>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    title: String,
    methods: Array,
    getAnchorId: Function
  },
  methods: {
    getMethodArgs(method) {
      if(!method.params) {
        return
      }
      return method.params.map(param => {
        return param.name + ":<b style='color: blue;'>" + (param.type || 'Any') + '</b>'
      }).join(', ')
    },
    getAnchor(method) {
      return this.getAnchorId(this.title, method)
    }
  }
}
</script>
<style scoped lang="less">
.detail-methods {
  margin-bottom: 2rem;

  h4 {
    font-weight: normal !important;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
  }

  .method {
    padding-bottom: 2.4rem;
    > .description {
      color: rgba(0, 0, 0, 0.6)
    }
  }

  .anchor {
    display: block;
    width: 100%;
    height: 1px;
    overflow: hidden;
  }

  
}
</style>