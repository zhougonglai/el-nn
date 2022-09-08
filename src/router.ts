import { createRouter, createWebHistory  } from 'vue-router';
import Default from './layout/default.vue';
import Home from './pages/home/index.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Default,
      children: [
        {
          path: '',
          component: Home
        },
        {
          path: 'setting',
          component: () => import(/* webpackChunkName: 'default.setting' */ './pages/setting/index.vue')
        }
      ]
    },
    {
      path: '/sign',
      component: () => import(/* webpackChunkName: 'sign.layout' */ './layout/sign.vue'),
      children: [
        {
          path: 'in',
          component: () => import('./pages/sign/in.vue'),
        },
        {
          path: 'up',
          component: () => import('./pages/sign/up.vue'),
        },
      ]
    }
  ]
})
