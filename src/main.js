// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'

// mock
import './mock'

import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
import './utils/filter' // global filter
import i18n from './locales'
import global from './global'


import { DatePicker } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

Vue.use(DatePicker)



// import vSelectPage from 'v-selectpage'
// Vue.use(vSelectPage)

Vue.config.productionTip = false

// mount axios Vue.$http and this.$http
Vue.use(VueAxios)

new Vue({
  router,
  store,
  i18n,
  created: bootstrap,
  data: function () {
    return {
           executor: global.employee,
           warehouse: global.warehouse
        }
  },
  render: h => h(App)
}).$mount('#app')
