import Vue from 'vue'
import App from './renderer/App.vue'
import router from './renderer/router'
import store from './renderer/store'
import '@/style/index.scss'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
