/* tslint:disable */
import { defineComponent } from 'vue'
import { h, onMounted, onUpdated, ref, inject } from 'vue'
import mermaid from 'mermaid'

import MarkDownItHighlight from './plugins/markdown-it-highlight'
import MarkdownItMermaid from './plugins/markdown-it-plugin-mermaid'
import MarkdownItImage from './plugins/markdown-it-image'

import MarkdownIt from 'markdown-it'

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
  name: 'VueMarkdownCore',
  props: defaultProps,
  setup(props) {
    const md = ref()
    const renderMarkdown = () => {
      //  实例化MarkdownIt
      // console.log(props, props.image)
      const optionImage = props.image
      const imageUrlSet = inject('imageUrlSet')
      optionImage.urlSet = imageUrlSet.value

      const markdown = new MarkdownIt()
        .use(MarkDownItHighlight, props.highlight)
        .use(MarkdownItMermaid, props.mermaid)
        .use(MarkdownItImage, optionImage)
        .set({
          breaks: props.breaks,
          html: props.html,
          langPrefix: props.langPrefix,
          linkify: props.linkify,
          quotes: props.quotes,
          typographer: props.typographer,
          xhtmlOut: props.xhtmlOut,
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
    return () => h('div', { innerHTML: md.value, class: 'markdown' })
  },
})