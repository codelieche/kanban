import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
// import VueMarkdown from '@/components/page/vue-markdown/index'

import router from './router'
import { useElementPlugins } from './plugins/element'
// import { useAxiosPlugin } from './plugins/fetchApi'
import './styles/main.less'
import './styles/font-awesome.min.css'

const app = createApp(App)
useElementPlugins(app)
// useAxiosPlugin(app)

// app.use(VueMarkdown)

app.use(router).mount('#app')