// import { createWebHistory, createRouter } from 'vue-router'
import Vue from 'vue'
import VueRouter from 'vue-router'
/* MasterLayout */
import MasterLayout from '@/layout/MasterLayout'
// import { HELP_DESK_ROUTER } from 'ff24-js/src/utils/Constant'

Vue.use(VueRouter)
// import Vue from 'vue'
// import VueRouter from 'vue-router'
/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: title               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: MasterLayout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/login'),
    hidden: true
  },
  {
    path: '/signup',
    component: () => import('@/views/signup/signup'),
    hidden: true
  },
  {
    path: '/verify',
    component: () => import('@/views/signup/verify-account'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: MasterLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/tainguyenmoitruong/booking/lab-booking'),
        name: 'Trang chủ',
        meta: { title: 'Đăng ký sử dụng PTN', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: MasterLayout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'profile',
        meta: { title: 'profile', icon: 'user', noCache: true }
      }
    ]
  }  
  // ...HELP_DESK_ROUTER(MasterLayout)
  // {
  //   path: '*',
  //   redirect: '/'
  // }
]

/**
 * asyncRoutes : load from database
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new VueRouter({
  // mode: 'history', // require service support
  allowHashBang: true,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

// const router = createRouter({
//   history: createWebHistory(),
//   constantRoutes
// })

// export function resetRouter() {
//   const newRouter = createRouter({
//     history: createWebHistory(),
//     constantRoutes
//   })
//   router.matcher = newRouter.matcher // reset router
// }

export default router
