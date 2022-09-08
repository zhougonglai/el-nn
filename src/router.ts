import { createRouter, createWebHistory  } from 'vue-router';
import Home from './pages/home/index.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/setting',
      component: () => import(/* webpackChunkHash */ './pages/setting/index.vue')
    }
  ]
})
