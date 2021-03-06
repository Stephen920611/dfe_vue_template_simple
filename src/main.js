import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import './utils/scrollbar' // 滚动条插件
import * as filters from './filters' // 全局的过滤器

import echarts from 'echarts'

Vue.prototype.$echarts = echarts // 引入echarts，将其绑定到vue原型上 使用时this.$echarts


/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 * 如果您不想使用模拟服务器，您想将MockJs用于模拟API，您可以执行：mockXHR（）
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 * 目前MockJs将用于生产环境，请在上线前将其删除！ ！ ！
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// 注册全局过滤器register global utility filters
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
