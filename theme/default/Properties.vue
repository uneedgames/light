<template>
  <div class="detail-properties">
    <h2 class="ui header">{{title}}</h2>
    <table class="ui table">
      <thead>
        <tr>
          <th width="160">Name</th>
          <th width="100">Group</th>
          <th width="100">Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="prop in properties">
          <td>{{prop.name}}</td>
          <td>{{prop.group}}</td>
          <td>{{prop.type}}</td>
          <td>
            <a class="anchor" :id="getAnchor(prop)"></a>
            <div v-html="prop.description"></div>
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
    properties: Array,
    getAnchorId: Function
  },
  methods: {
    getAnchor(prop) {
      console.log(this.title)
      return this.getAnchorId(this.title, prop)
    }
  }
}
</script>
<style scoped lang="less">
.detail-properties {
  margin-bottom: 2rem;

  td {
    position: relative;
  }

  .anchor {
    display: block;
    width: 100%;
    height: 1px;
    overflow: hidden;
  }
}
</style>