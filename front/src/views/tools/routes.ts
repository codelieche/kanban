// Tools相关的路由
import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    component: () => import('./home/index.vue')
  }
]

const subComponents = [
  {
    path: 'search',
    filename: 'search/index'
  },
  {
    path: 'search2/',
    redirect: '/tools/search'
  }
]

subComponents.forEach(item => {
  if (typeof item === 'object') {
    if (item.redirect) {
      routes.push({
        path: item.path,
        redirect: item.redirect
      })
    } else {
      routes.push({
        path: item.path,
        component: () => import(`./${item.filename}.vue`)
      })
    }
  } else {
    routes.push({
      path: item,
      component: () => import(`./${item}.vue`)
    })
  }
})

export default routes
