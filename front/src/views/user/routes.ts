// Vue 图标相关相关的路由

const routes = [
  {
    path: '',
    // name: 'ChartHome',
    component: () => import('./home.vue')
  }
]

const subComponents = [
  {
    path: 'group',
    filename: 'group/index'
  },
  {
    path: 'list',
    filename: 'list/index'
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
