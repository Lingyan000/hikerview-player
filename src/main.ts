import Vue from 'vue'
import App from './renderer/App.vue'
import router from './renderer/router'
import db from '#/datastore'
import store from './renderer/store'
import '@/style/index.scss'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.prototype.$db = db

Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
