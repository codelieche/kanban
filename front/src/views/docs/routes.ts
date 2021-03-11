import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/docs/group/list'
  }
]

const subComponents = [
  // 分组
  {
    path: 'group',
    redirect: '/docs/group/list'
  },
  {
    path: 'group/list',
    filename: 'group/list'
  },
  {
    path: 'group/add',
    filename: 'group/add'
  },
  {
    path: 'group/:id(\\d+)',
    filename: 'group/detail'
  },
  {
    path: 'group/:id(\\d+)/editor',
    filename: 'group/editor'
  },

  //   图片
  {
    path: 'image',
    redirect: '/docs/image/list'
  },
  {
    path: 'image/list',
    filename: 'image/list'
  },
  // 文章
  {
    path: 'article',
    redirect: '/docs/article/list'
  },
  {
    path: 'article/list',
    filename: 'article/list'
  },
  // {
  //   path: 'article/:id(\\d+)',
  //   filename: 'article/detail'
  // },

  // 讨论/评论
  {
    path: 'discussion',
    redirect: '/docs/discussion/list'
  },
  {
    path: 'discussion/list',
    filename: 'discussion/list'
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
