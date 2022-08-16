import Vue from 'vue'
import App from './App'
// import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import Element from 'element-ui'
import 'ff24-layout/src/theme/lib/element-variables.css'
import 'ff24-layout/src/theme/lib/index.css' // global css
import './styles/tainguyenmoitruong.css'
import store from './store'
import router from './router/routerFactory'
import './icons' // icon
import './permission' // permission control
import * as filters from './filters' // global filters
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faAppleAlt,
  faExchangeAlt,
  faShieldAlt,
  faSignOutAlt,
  faUser,
  faUserPlus,
  faUsers,
  faUsersCog,
  faUserSecret,
  faUserShield
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import i18n from './lang'
import Pagination from 'ff24-customs-lib/src/components/Pagination'
import { ElButtonAction, ElInputEtc } from 'ff24-customs-lib'
import SelectListMaHq from 'ff24-customs-lib/src/lib-components/BaseFormCustoms/SelectListMaHq'
import ElTableEtc from 'ff24-customs-lib/src/components/ElTableETC/ElTableEtc'
import { getToken } from 'ff24-js/src/utils/authCookie'
import { cacheCategories } from 'ff24-js/src/utils/ECustomsUtils'
import { numberRule, requiredRule, specialCharRule, validateRegex } from 'ff24-js/src/utils'
import ElTableEtcCustom from './components/BaseFormCustoms/ElTableEtcCustom'
import { cacheLocal } from './utils/ECustomsUtils'

/* BaseComponent*/
Vue.component('el-table-etc', ElTableEtc)
Vue.component('el-table-etc-custom', ElTableEtcCustom)
Vue.component('el-input-etc', ElInputEtc)
Vue.component('el-button-action', ElButtonAction)
Vue.component('select-list-ma-hq', SelectListMaHq)
Vue.component('pagination', Pagination)
Vue.component('font-awesome-icon', FontAwesomeIcon)
/* BaseComponent*/

/* Khai báo các method phạm vi toàn cục*/
Vue.mixin({
  methods: {
    requiredRule,
    numberRule,
    specialCharRule,
    validateRegex
  }
})

Vue.use(Element, {
  size: 'mini', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

library.add(
  faUser,
  faSignOutAlt,
  faUserSecret,
  faUserShield,
  faUsersCog,
  faUsers,
  faUserPlus,
  faAppleAlt,
  faExchangeAlt,
  faShieldAlt
)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

if (getToken()) {
  cacheCategories()
  cacheLocal()
  setInterval(() => {
    cacheCategories()
  }, 120 * 1000)
}

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  created() {
    // vueENV = process.env
  },
  render: h => h(App)
})
