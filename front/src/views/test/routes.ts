// Vue 图标相关相关的路由

import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    // name: 'ChartHome',
    component: () => import('./home.vue')
  }
]

const subComponents = [
  // Input
  'test',
  'page',
  {
    path: 'editor',
    filename: 'editor/index'
  },
  'test2'
]

subComponents.forEach(item => {
  if (typeof item === 'object') {
    routes.push({
      path: item.path,
      component: () => import(`./${item.filename}.vue`)
    })
  } else {
    routes.push({
      path: item,
      component: () => import(`./${item}.vue`)
    })
  }
})

export default routes
