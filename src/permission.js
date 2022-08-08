import router from './router/routerFactory'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import store from '@/store'
import { beforeEach } from 'ff24-js/src/utils/BeforeEachRouter'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

export function createComponent(path) {
  return require(`${path}.vue`).default
}

router.beforeEach(async(to, from, next) => {
  await beforeEach(to, from, next, NProgress, store, router)
})

router.afterEach(() => {
  NProgress.done()
})
