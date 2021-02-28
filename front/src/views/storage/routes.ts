import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/storage/object/list'
  }
]

const subComponents = [
  // 存储账号
  {
    path: 'account',
    redirect: '/storage/account/list'
  },
  {
    path: 'account/list',
    filename: 'account/list'
  },
  {
    path: 'account/add',
    filename: 'account/add'
  },
  {
    path: 'account/:id(\\d+)',
    filename: 'account/detail'
  },
  {
    path: 'account/:id(\\d+)/account',
    filename: 'account/editor'
  },

  //   对象
  {
    path: 'object',
    redirect: '/storage/object/list'
  },
  {
    path: 'object/list',
    filename: 'object/list'
  },
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
