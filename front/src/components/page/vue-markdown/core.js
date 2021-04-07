/* tslint:disable */
import { defineComponent } from 'vue'
import { h, onMounted, onUpdated, ref, inject } from 'vue'
import mermaid from 'mermaid'

import MarkDownItHighlight from './plugins/markdown-it-highlight'
import MarkdownItMermaid from './plugins/markdown-it-plugin-mermaid'
import MarkdownItImage from './plugins/markdown-it-image'
import MarkdownItContainer from './plugins/markdown-it-container'

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
        .use(MarkdownItContainer, 'warning', {
          validate: function(params) {
            return params.trim() === 'warning'
          },
          render: (tokens, idx) => {
            if (tokens[idx].nesting === 1) {
              const icon = `<i class="markdown-it-vue-alert-icon markdown-it-vue-alert-icon-warning"><svg viewBox="64 64 896 896" data-icon="exclamation-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"></path></svg></i>`
              return `<div class="markdown-it-vue-alter markdown-it-vue-alter-warning">${icon}`
            } else {
              return '</div>'
            }
          }
        })
        .use(MarkdownItContainer, 'info', {
          validate: function(params) {
            return params.trim() === 'info'
          },
          render: (tokens, idx) => {
            if (tokens[idx].nesting === 1) {
              const icon = `<i class="markdown-it-vue-alert-icon markdown-it-vue-alert-icon-info"><svg viewBox="64 64 896 896" data-icon="info-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"></path></svg></i>`
              return `<div class="markdown-it-vue-alter markdown-it-vue-alter-info">${icon}`
            } else {
              return '</div>'
            }
          }
        })
        .use(MarkdownItContainer, 'success', {
          validate: function(params) {
            return params.trim() === 'success'
          },
          render: (tokens, idx) => {
            if (tokens[idx].nesting === 1) {
              const icon = `<i class="markdown-it-vue-alert-icon markdown-it-vue-alert-icon-success"><svg viewBox="64 64 896 896" data-icon="check-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path></svg></i>`
              return `<div class="markdown-it-vue-alter markdown-it-vue-alter-success">${icon}`
            } else {
              return '</div>'
            }
          }
        })
        .use(MarkdownItContainer, 'error', {
          validate: function(params) {
            return params.trim() === 'error'
          },
          render: (tokens, idx) => {
            if (tokens[idx].nesting === 1) {
              const icon = `<i class="markdown-it-vue-alert-icon markdown-it-vue-alert-icon-error"><svg viewBox="64 64 896 896" data-icon="close-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path></svg></i>`
              return `<div class="markdown-it-vue-alter markdown-it-vue-alter-error">${icon}`
            } else {
              return '</div>'
            }
          }
        })
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