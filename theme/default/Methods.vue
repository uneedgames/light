<template>
  <div class="detail-methods">
    <h5>{{title}}</h5>
    <table class="bordered">
      <tbody>
        <tr v-for="method in methods">
          <td>
            <h6 class="method">{{method.name}}({{getMethodArgs(method)}}):{{method.type || 'void'}}</h6>
            <div v-html="method.description"></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>

export default {
  props: {
    title: String,
    methods: Array,
  },
  methods: {
    getMethodArgs(method) {
      console.log(method.params)
      if(!method.params) {
        return
      }
      return method.params.map(param => {
        return param.name + ":" + (param.type || 'Any')
      }).join(', ')
    }
  }
}
</script>
<style scoped lang="less">
.detail-methods {
  .method {
    font-weight: bold;
  }
}
</style>