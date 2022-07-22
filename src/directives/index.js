// import Vue from 'vue'
// Vue.directive('imgerror', {
//   // 指令所在标签插入dom时执行
//   // inserted (el, binding) {
//   //   el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
//   // },
//   // 数据更新的时候就执行
//   update (el, binding) {
//     el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
//   }
// })

export const imgerror = {
  update (el, binding) {
    el.onerror = function () {
      this.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
    }
  }
}
