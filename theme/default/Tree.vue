<template>
  <div class="tree">
    <div class="node" :class="nodeClass" @dblclick="toggle" @click="toggleSelect">
      <i class="arrow icon fa" :class="arrowClass" aria-hidden="true" @click="toggle()"></i>
      <span v-if="label" :class="label.class">{{label.text}}</span>
      <span class="text">{{tree.name}}</span>
    </div>
    <div v-if="tree.toggle && sortedChildren && sortedChildren.length" class="children">
      <tree v-for="(child,idx) in sortedChildren" :key="idx" :tree="child" :tree-id="treeId" :level="curLevel+1" :onSelect="onSelect"></tree>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import sortChildren from './sortChildren'

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
    sortedChildren() {
      return sortChildren(this.tree.children).filter(child => {
        return child.isNamespace || child.isModule || child.isClass
      })
    },
    arrowClass() {
      if(this.sortedChildren.length === 0) {
        return ''
      }
      return this.toggled ? 'fa-caret-down' : 'fa-caret-right'
    },
    label() {
      if(this.tree.isNamespace) {
        return {
          class: 'label namespace',
          text: 'NS'
        }
      }
      if(this.tree.isModule) {
        return {
          class: 'label module',
          text: 'M'
        }
      }
      if(this.tree.isClass) {
        return {
          class: 'label class',
          text: 'C'
        }
      }
      if(this.tree.isMethod) {
        return {
          class: 'label method',
          text: 'M'
        }
      }
      if(this.tree.isConst) {
        return {
          class: 'label const',
          text: 'C'
        }
      }
      if(this.tree.isProperty) {
        return {
          class: 'label property',
          text: 'P'
        }
      }
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
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
  font-size: 0px;

  &.selected {
    background: #dddddd;
    color: #222222;
  }

  .arrow {
    margin-left: 5px;
    color: #aaaaaa;
    font-size: 12px;
  }

  .icon {
    width: 13px;
    height: 13px;
    text-align: center;
    font-size: 12px;
  }

  .text {
    margin-left: 3px;
    white-space: nowrap;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
  }

  .label {
    font-size: 12px;
    color: white;
    border-radius: 3px;
    padding: 2px 4px 1px 4px; 
    display: inline-block;
    text-align: center;
    transform: scale(0.8);
  }
}
</style>
