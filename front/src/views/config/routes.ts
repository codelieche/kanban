import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/config/menu/list'
  }
]

const subComponents = [
  {
    path: 'menu',
    redirect: '/config/menu/list'
  },
  {
    path: 'menu/list',
    filename: 'menu/list',
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
