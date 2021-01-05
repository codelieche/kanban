// Vue 图标相关相关的路由

import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    // name: 'ChartHome',
    component: () => import('./home.vue'),
  }
]

const subComponents = [
  {
    path: 'group',
    filename: 'group/index',
    redirect: '/user/group/list'
  },
  'group/list',
  {
    path: 'list',
    filename: 'list/index',
  },
  {
    path: 'center',
    filename: 'center/index'
  },
  {
    path: 'message',
    filename: 'message/index'
  },
  {
    path: 'login',
    filename: 'login/index'
  },
  
  // 退出登录
  "logout"
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
