import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
// 什么时候用插件？我们封装了一堆的公共组件供同事使用的时候，为了同事方便
import components from '@/components'
// Vue.use的时候会自动执行insinstall方法
Vue.use(components)
import '@/icons' // icon
import '@/permission' // permission control
import * as obj from '@/directives'
Object.keys(obj).forEach(item => {
  Vue.directive(item, obj[item])
})

import * as filters from '@/filters'
Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

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
