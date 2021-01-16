import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/tags/key/list'
  }
]

const subComponents = [
  {
    path: 'key',
    redirect: '/tags/key/list'
  },
  {
    path: 'key/list',
    filename: 'key/list',
  },
  {
    path: 'value',
    redirect: '/tags/value/list'
  },
  {
    path: 'value/list',
    filename: 'value/list',
  },
  {
    path: 'objecttag',
    redirect: '/tags/objecttag/list'
  },
  {
    path: 'objecttag/list',
    filename: 'objectTag/list',
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
