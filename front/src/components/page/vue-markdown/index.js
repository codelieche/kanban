/* eslint-disable @typescript-eslint/no-explicit-any */
import VueMarkdown from './markdown'

const install = (Vue) => {
    Vue.component(VueMarkdown.name, VueMarkdown)
}

if (typeof window !== 'undefined' && window.Vue){
    install(window.Vue)
}

VueMarkdown.install = install

export default VueMarkdown