import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// 引入子路曰
import userRoutes from '@/views/user/routes'
import testRoutes from '@/views/test/routes'

const routes: Array<RouteRecordRaw> = [
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
      {
        path: 'user',
        // name: 'BaseIndex',
        component: () => import('@/views/user/index.vue'),
        children: userRoutes
      },
      {
        path: 'test',
        component: () => import('@/views/test/index.vue'),
        children: testRoutes
      }
    ]
  }

  // 用户相关模块
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router