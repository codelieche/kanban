import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// 引入子路曰
import docsRoutes from '@/views/docs/routes'
import userRoutes from '@/views/user/routes'
import storageRoutes from '@/views/storage/routes'
import tagsRoutes from '@/views/tags/routes'
import configRoutes from '@/views/config/routes'
import toolsRoutes from '@/views/tools/routes'
import testRoutes from '@/views/test/routes'
import errorRoutes from '@/views/errors/routes'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/user/login',
    name: 'UserLogin',
    // component: Home
    component: () => import('@/views/user/login/index.vue')
  },
  {
    path: '/',
    name: 'DefaultHome',
    // component: Home
    component: () => import('@/views/home/default.vue'),
    children: [
      {
        path: '',
        name: 'HomePage',
        component: () => import('@/views/home/home.vue')
      },
      // 文档相关管理页面
      {
        path: 'docs',
        component: () => import('@/views/docs/index.vue'),
        children: docsRoutes
      },

      // 标签页
      {
        path: 'tags',
        component: () => import('@/views/tags/index.vue'),
        children: tagsRoutes
      },
      {
        path: 'user',
        // name: 'BaseIndex',
        component: () => import('@/views/user/index.vue'),
        children: userRoutes
      },
      {
        path: 'storage',
        component: () => import('@/views/storage/index.vue'),
        children: storageRoutes
      },
      {
        path: 'config',
        component: () => import('@/views/config/index.vue'),
        children: configRoutes
      },
      {
        path: 'tools',
        component: () => import('@/views/tools/index.vue'),
        children: toolsRoutes
      },
      {
        path: 'test',
        component: () => import('@/views/test/index.vue'),
        children: testRoutes
      }
    ]
  },

  // 文章详情页
  {
    path: '/docs/article',
    name: 'ArticleHome',
    component: () => import('@/views/home/article.vue'),
    children: [
      // 文章详情页
      {
        path: ':id(\\d+)',
        component: () => import('@/views/docs/article/detail/index.vue')
      }
    ]
  },

  // 错误页
  {
    path: '/errors',
    component: () => import('@/views/errors/index.vue'),
    children: errorRoutes
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
