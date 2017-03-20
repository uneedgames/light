<template>
  <div v-sticky class="hierarchy ui vertical sticky inverted menu">
    <div class="item">
      <a v-if="options.logo" class="ui logo icon image" href="/">
        <img :src="options.logo">
      </a>
      <a href="/"><b>{{options.title}}</b></a>
    </div>
    <div class="item" style="display: none;">
      <a href="/"><b>Articles</b></a>
    </div>

    <!-- API nav -->
    <div v-for="subtree in tree" class="item">
      <div class="header"><a @click="onClickItem(subtree)">{{subtree.path}}</a></div>
      <div class="menu">
          <a v-for="sub in sortChildren(subtree)" class="item" @click="onClickItem(sub)">
            <span :class="getNameClass(sub)">{{sub.name}}</span>
            <div class="ui label" :class="getLabelClass(sub)">{{getLabelText(sub)}}</div>
          </a>
      </div>
    </div>

  </div>
</template>
<script>
import sortChildren from './sortChildren'
import getLabelNameAndColor from './getLabelNameAndColor'

export default {
  components: { },
  props: {
    options: Object,
    tree: Array,
    onSelect: Function
  },

  methods: {
    sortChildren(subtree) {
      return sortChildren(subtree.children).filter((node) => {
        return node.isNamespace || node.isClass || node.isModule
      })
    },
    getLabelClass(item) {
      return getLabelNameAndColor(item).color
    },
    getLabelText(item) {
      return getLabelNameAndColor(item).text
    },
    getNameClass(item) {
      if(item.isDeprecated) {
        return 'deprecated'
      }
    },
    onClickItem(item) {
      this.onSelect && this.onSelect(item)
    }
  }
}
</script>
<style scoped lang="less">
.hierarchy {
  width: 100% !important;
  min-height: 100%;
  border-radius: 0 !important;

  .logo > img {
    height: 34px;
    margin-right: 1em;
  }

  > .item >.header a {
    color: #f1f1f1;
    cursor: pointer;
  }

  > .item >.header a:hover {
    color: #FFFFFF;
  }
}
</style>