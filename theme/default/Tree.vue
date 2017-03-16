<template>
  <div class="tree">
    <div class="node" :class="nodeClass" @dblclick="toggle" @click="toggleSelect">
      <i class="arrow icon fa" :class="arrowClass" aria-hidden="true" @click="toggle()"></i>
      <i v-if="iconClass" class="icon fa" :class="iconClass" aria-hidden="true"></i>
      <span class="name">{{tree.name}}</span>
    </div>
    <div v-if="tree.toggle && tree.children && tree.children.length" class="children">
      <tree v-for="(child,idx) in tree.children" :key="idx" :tree="child" :tree-id="treeId" :level="curLevel+1" :onSelect="onSelect"></tree>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

const treeSelection = {}

export default {
  name: 'tree',
  props: {
    treeId: String,
    tree: Object,
    level: Number,
    onSelect: Function,
  },
  computed: {
    arrowClass() {
      return this.toggled ? 'fa-caret-down' : 'fa-caret-right'
    },
    iconClass() {
      let clazz = ''
      return clazz
    },
    nodeClass() {
      return this.selected ? 'selected' : ''
    },
    curLevel() {
      return this.level || 0
    }
  },

  data() {
    return {
      selected: false,
      toggled: this.tree.toggle || false,
    }
  },

  mounted() {
    this.getNode().css({
      paddingLeft: this.curLevel * 10 + 'px'
    })
  },

  beforeDestroy() {
    if(this.selected) {
      treeSelection[this.treeId] = null
    }
  },

  methods: {

    isTreeNode() {
      return true
    },

    getNode() {
      return $(this.$el).find('>.node')
    },

    toggle() {
      this.toggled = this.tree.toggle = !this.tree.toggle
    },

    toggleSelect() {
      let selection = treeSelection[this.treeId]
      if(selection) {
        selection.selected = false
      }
      this.selected = true
      treeSelection[this.treeId] = this
      this.onSelect && this.onSelect(this)
    }
  }
}
</script>

<style scoped lang="less">
.tree {
  width: 100%;
  height: 100%;
  font-size: 13px;
  user-select: none;
  color: #5a5a5a;
}

.node {
  cursor: default;
  position: relative;
  padding: 3px 5px;
  color: #5a5a5a;
  user-select: none;

  &.selected {
    background: #dddddd;
    color: #222222;
  }

  .arrow {
    margin-left: 5px;
  }

  .icon {
    width: 13px;
    height: 13px;
    text-align: center;
  }

  .text {
    color: #aaaaaa;
    white-space: nowrap;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
