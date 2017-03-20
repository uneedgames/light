<template>
  <div class="detail" v-if="node">
    <div class="ui masthead vertical segment">
      <div class="ui content">
        <h1 class="ui header">
          <div v-for="label in labels" class="ui label" :class="label.color">{{label.text}}</div>
          <span :class="getPathClass(node)">{{node.path}}</span>
          <span class="extends" v-if="node.extend">extends</span>
          <span v-if="node.extend">{{node.extend}}</span>
        </h1>
      </div>
    </div>
    <div class="spacing"></div>
    <div class="main ui content">

      <div v-if="hasOutline" class="ui dividing right rail">
        <div class="ui">
          <h4 class="ui header">Outline</h4>
          <div class="ui vertical following fluid text menu">

            <div v-if="constants.length > 0" class="item">
              <a class="active title"><b>Constants</b></a>
              <div class="active content menu">
                <a v-for="item in constants" class="item" :href="'#constants-' + item.name">{{item.name}}</a>
              </div>
            </div>

            <div v-if="staticProperties.length > 0" class="item">
              <a class="active title"><b>Static Properties</b></a>
              <div class="active content menu">
                <a v-for="item in staticProperties" class="item" :href="'#static-properties-' + item.name">{{item.name}}</a>
              </div>
            </div>

            <div v-if="staticMethods.length > 0" class="item">
              <a class="active title"><b>Static Methods</b></a>
              <div class="active content menu">
                <a v-for="item in staticMethods" class="item" :href="'#static-methods-' + item.name">{{item.name}}</a>
              </div>
            </div>

            <div v-if="properties.length > 0" class="item">
              <a class="active title"><b>Properties</b></a>
              <div class="active content menu">
                <a v-for="item in properties" class="item" :href="'#properties-' + item.name">{{item.name}}</a>
              </div>
            </div>

            <div v-if="methods.length > 0" class="item">
              <a class="active title"><b>Methods</b></a>
              <div class="active content menu">
                <a v-for="item in methods" class="item" :href="'#methods-' + item.name">{{item.name}}</a>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      <div class="left">
        <p class="description" v-html="description"></p>
        
        <properties v-if="constants.length > 0" title="Constants" :properties="constants" :getAnchorId="getAnchorIdFunc"></properties>
        <properties v-if="staticProperties.length > 0" title="Static Properties" :properties="staticProperties" :getAnchorId="getAnchorIdFunc"></properties>
        <methods v-if="staticMethods.length > 0" title="Static Methods" :methods="staticMethods" :getAnchorId="getAnchorIdFunc"></methods>
        <properties v-if="properties.length > 0" title="Properties" :properties="properties" :getAnchorId="getAnchorIdFunc"></properties>
        <methods v-if="methods.length > 0" title="Methods" :methods="methods" :getAnchorId="getAnchorIdFunc"></methods>
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
import hljs from 'highlight.js'
import marked from 'marked'
import renderer from './MarkedRenderer'
import sortChildren from './sortChildren'
import getLabelNameAndColor from './getLabelNameAndColor'
import Properties from './Properties.vue'
import Methods from './Methods.vue'

marked.setOptions({
  renderer: renderer,
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  }
})

export default {
  components: {
    Properties,
    Methods
  },
  props: {
    options: Object,
    node: Object
  },
  computed: {
    hasOutline() {
      return this.node.children.length > 0
    },
    constants() {
      return sortChildren(this.node.children.filter((child) => child.isConst))
    },
    staticProperties() {
      return sortChildren(this.node.children.filter((child) => child.isStatic && child.isProperty && !child.isConst))
    },
    staticMethods() {
      return sortChildren(this.node.children.filter((child) => child.isStatic && child.isMethod))
    },
    properties() {
      return sortChildren(this.node.children.filter((child) => !child.isStatic && child.isProperty && !child.isConst))
    },
    methods() {
      return sortChildren(this.node.children.filter((child) => !child.isStatic && child.isMethod))
    },
    labels() {
      return getLabelNameAndColor(this.node, true)
    },
    getAnchorIdFunc(title) {
      return (title, item) => title.replace(/ /ig, '-').toLowerCase() + '-' + item.name
    },
    description() {
      return marked(this.node.description)
    }
  },
  methods: {
    getPathClass(node) {
      if(node.isDeprecated) return 'deprecated'
    }
  }
}
</script>
<style scoped lang="less">
.detail {
  width: 100%;
  height: 100%;
  overflow: auto;

  .extends {
    font-size: 1.4rem;
    color: #999999;
    font-weight: normal;
    margin: 0 6px;
  }

  .masthead .ui.content {
    margin: 0 3rem !important;
  }

  .ui.main {
    max-width: 1200px !important;

    position: relative;
    width: auto !important;
    margin-left: 3rem !important;
    margin-right: 318px !important;

    > .left {
      padding-top: 1rem;
      padding-bottom: 1rem;

      > .description {
        color: rgba(0,0,0,.6);
        padding-bottom: 2rem;
      }
    }

    > .right.rail {
      width: 260px;
      padding-top: 1rem;
      padding-bottom: 1rem;

      .active.title {
        color: #222;
      }
    }
  }

  .spacing {
    height: 38px;
  }
  
}
.deprecated {
  color: #999999;
}
</style>
<style>
.ui.container.main h2 {
  margin-top: 1.2em;
}
</style>