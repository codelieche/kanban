// Vue 图标相关相关的路由

import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
 
]

const subComponents = [
  {
    path: '',
    redirect: '/user/message/all'
  },
  {
    path: ':id(\\d+)',
    filename: 'detail'
  },
  {
    path: ':type(all|unread|read)',
    filename: 'list'
  },
]

subComponents.forEach(item => {
  if (typeof item === 'object') {
    if( item.redirect){
      routes.push({
        path: item.path,
        redirect: item.redirect,
      })
    }else{
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
