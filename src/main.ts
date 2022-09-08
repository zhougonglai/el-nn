import { createApp } from 'vue'
import App from './App.vue'
import './main.scss';
import store from './store'
import router from './router';
// import './samples/node-api'

createApp(App)
  .use(router)
  .use(store)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
