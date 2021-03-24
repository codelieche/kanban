/* tslint:disable */

import { h, onMounted, onUpdated, ref } from 'vue'
import mermaid from 'mermaid'

import MarkDownItHighlight from './plugins/markdown-it-highlight'
import MarkdownItMermaid from './plugins/markdown-it-plugin-mermaid'

import MarkdownIt from 'markdown-it'

// 默认的属性
const defaultProps = {
  anchor: {
    type: Object,
    default: () => ({})
  },
  breaks: {
    type: Boolean,
    default: false
  },
  emoji: {
    type: Object,
    default: () => ({})
  },
  highlight: {
    type: Object,
    default: () => ({})
  },
  mermaid: {
    type: Object,
    default: () => ({
      theme: 'default',
      startOnLoad: true,
    })
  },
  html: {
    type: Boolean,
    default: false
  },
  langPrefix: {
    type: String,
    default: 'language-'
  },
  linkify: {
    type: Boolean,
    default: false
  },
  plugins: {
    type: Array,
    default: () => []
  },
  quotes: {
    type: String,
    default: '“”‘’'
  },
  source: {
    type: String,
    default: ''
  },
  tasklists: {
    type: Object,
    default: () => ({})
  },
  toc: {
    type: Object,
    default: () => ({})
  },
  typographer: {
    type: Boolean,
    default: false
  },
  xhtmlOut: {
    type: Boolean,
    default: false
  }
}

export default {
  name: 'VueMarkdown',
  props: defaultProps,
  setup(props) {
    const md = ref()
    const renderMarkdown = () => {
      //  实例化MarkdownIt
      const markdown = new MarkdownIt()
      .use(MarkDownItHighlight, props.highlight)
      .use(MarkdownItMermaid, props.mermaid)
      .set({
        breaks: props.breaks,
        html: props.html,
        langPrefix: props.langPrefix,
        linkify: props.linkify,
        quotes: props.quotes,
        typographer: props.typographer,
        xhtmlOut: props.xhtmlOut
      })

      props.plugins.forEach(({ plugins, options = {} }) => {
          markdown.use(plugins, options)
      })

      md.value = markdown.render(props.source)
    }

    // 组件挂载之后
    onMounted(() => {
      mermaid.initialize({})
      // console.log(props.source)
        renderMarkdown()
        // import("mermaid/dist/mermaid").then(m => {
        //   m.initialize({
        //     startOnLoad: true
        //   });
        //   m.init();
        //   console.log('Mermaid Init')
        // });
    })

    // 组件更新
    onUpdated(() => {
        renderMarkdown()
    })

    // 返回
    return () => h('div', { innerHTML: md.value})
  }

}
