import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// 引入子路曰
import docsRoutes from '@/views/docs/routes'
import userRoutes from '@/views/user/routes'
import tagsRoutes from '@/views/tags/routes'
import configRoutes from '@/views/config/routes'
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
    name: 'Home',
    // component: Home
    component: () => import('@/views/home/index.vue'),
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
        path: 'config',
        component: () => import('@/views/config/index.vue'),
        children: configRoutes
      },
      {
        path: 'test',
        component: () => import('@/views/test/index.vue'),
        children: testRoutes
      }
    ]
  },
  // 用户相关模块
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
