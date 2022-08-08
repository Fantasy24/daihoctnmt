import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)
const libStore = require.context('ff24-js/src/store', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modulesItem, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modulesItem[moduleName] = value.default
  return modulesItem
}, {})

const libModules = libStore.keys().reduce((modulesItem, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = libStore(modulePath)
  modulesItem[moduleName] = value.default
  return modulesItem
}, {})

const store = new Vuex.Store({
  modules: {
    ...modules,
    ...libModules
  },
  getters
})

export default store
