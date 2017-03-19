<template>
  <div class="detail-properties">
    <h5>{{title}}</h5>
    <table class="bordered">
      <tbody>
        <tr v-for="prop in properties">
          <td>{{prop.name}}</td>
          <td>{{prop.type}}</td>
          <td>{{prop.description}}</td>
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
  }
}
</script>
<style scoped lang="less">
.detail-properties {

}
</style>