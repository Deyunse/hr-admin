import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from './store'
// vip 白名单
const whiteList = ['/login', '/404']
router.beforeEach((to, from, next) => {
  NProgress.start()
  const token = store.state.user.token
  if (token) {
    // 如果登陆过，就不能再登录了，直接去后台首页
    if (to.path === '/login') {
      NProgress.done()
      next('/')
    } else {
      if (!store.state.user.userInfo.id) {
        store.dispatch('user/getInfo')
      }
      // 如果登录过想去其他页面直接放行
      next()
    }
  } else {
    if (whiteList.includes(to.path)) { // 如果没有登录 如果有这个数组里面的路径直接放行
      next()
    } else {
      next('/login') // 否则没有登录的话 就去登录
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})
