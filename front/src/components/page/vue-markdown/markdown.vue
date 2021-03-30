<template>
  <VueMarkdownCore v-bind="props" />
</template>

<script>
/* tslint:disable */
import { defineComponent, provide, ref } from 'vue'

import VueMarkdownCore from './core'

// 默认的属性
const defaultProps = {
  anchor: {
    type: Object,
    default: () => ({}),
  },
  image: {
    type: Object,
    default: () => ({
      hAlign: 'left',
      viewer: true,
    }),
  },
  breaks: {
    type: Boolean,
    default: false,
  },
  emoji: {
    type: Object,
    default: () => ({}),
  },
  highlight: {
    type: Object,
    default: () => ({}),
  },
  mermaid: {
    type: Object,
    default: () => ({
      theme: 'default',
      startOnLoad: true,
    }),
  },
  html: {
    type: Boolean,
    default: false,
  },
  langPrefix: {
    type: String,
    default: 'language-',
  },
  linkify: {
    type: Boolean,
    default: false,
  },
  plugins: {
    type: Array,
    default: () => [],
  },
  quotes: {
    type: String,
    default: '“”‘’',
  },
  source: {
    type: String,
    default: '',
  },
  tasklists: {
    type: Object,
    default: () => ({}),
  },
  toc: {
    type: Object,
    default: () => ({}),
  },
  typographer: {
    type: Boolean,
    default: false,
  },
  xhtmlOut: {
    type: Boolean,
    default: false,
  },
}

export default defineComponent({
  name: 'VueMarkdown',
  props: defaultProps,
  components: {
    VueMarkdownCore,
  },
  setup(props) {
    // 全局的image
    const imageUrlSet = ref(new Set())
    provide('imageUrlSet', imageUrlSet)

    return {
      props,
      imageUrlSet,
    }
  },
})
</script>
