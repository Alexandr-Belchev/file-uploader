import Vue from 'vue'
import App from './App.vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
Vue.prototype._ = function () {
  return this.$t.apply(this, arguments)
}
const messages = { current: window.catalog || {} }
export const i18n = new VueI18n({
  locale: 'current',
  messages,
  silentTranslationWarn: true
})
new Vue({
  i18n,
  render: h => h(App)
}).$mount('#app')
