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

<style lange="less">
.markdown-it-vue-alter-info {
  /* border: 1px solid #91d5ff;
  background-color: #e6f7ff; */
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
}
.markdown-it-vue-alert-icon-info {
  color: #1890ff;
}
.markdown-it-vue-alter-success {
  /* border: 1px solid #b7eb8f;
  background-color: #f6ffed; */
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
}
.markdown-it-vue-alert-icon-success {
  color: #52c41a;
}
.markdown-it-vue-alter-error {
  border: 1px solid #f5222d;
  background-color: #fff1f0;
}
.markdown-it-vue-alert-icon-error {
  color: #f5222d;
}
.markdown-it-vue-alter-warning {
  /* border: 1px solid #ffe58f;
  background-color: #fffbe6; */
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
}
.markdown-it-vue-alert-icon-warning {
  color: #faad14;
}
.markdown-it-vue-alter {
  margin-top: 5px;
  margin-bottom: 10px;
  display: inline-flex;
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.4;
  color: rgba(0, 0, 0, 0.85);
  box-sizing: border-box;
  list-style: none;
  position: relative;
  padding: 8px 15px 8px 37px;
  border-radius: 5px;
  width: 100%;
  min-height: 35px;
  /* border: 0; */
}
.markdown-it-vue-alter p {
  margin-bottom: 2px !important;
}

.markdown-it-vue-alert-icon {
  top: 10px;
  left: 16px;
  position: absolute;
}
</style>
