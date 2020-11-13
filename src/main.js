// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import less from 'less'
import './assets/fonts/iconfont.css'
import './assets/css/main.css'
import VCharts from 'v-charts';

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VCharts)
	
Vue.use(less)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
