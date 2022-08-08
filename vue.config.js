'use strict'
// const { defineConfig } = require('@vue/cli-service')

// module.exports = defineConfig({
//   // options...
// })
// import path from 'path'
const path = require('path')
const defaultSettings = require('./src/settings.js')
// const { VueLoaderPlugin } = require('vue-loader-v16')
// const VueLoaderPlugin = require('vue-loader/lib/plugin')
// const { VueLoaderPlugin } = require('@vue/vue-loader-v15')

function resolve(dir) {
  // path.resolve()
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || process.env.VUE_APP_HEADER
const port = process.env.port || process.env.npm_config_port || 8689 // dev port

// Plugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin')

const myHtmlPlug = new HtmlWebpackPlugin()
const myPreloadPlug = new PreloadWebpackPlugin({
  rel: 'preload',
  fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
  include: 'initial'
})
// const myVueLoader = new VueLoaderPlugin()

module.exports = {
  publicPath: process.env.VUE_APP_CONTEXT_ROOT,
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: false,
    disableHostCheck: true,
    client: {
      overlay: {
        warnings: true,
        errors: true
      }
    }
  },
  transpileDependencies: false,
  // entry: {
  //   'javascript': './js/app.js',
  //   'html': './index.html'
  // },
  // output: {
  //   path: __dirname + '/dist',
  //   filename: 'app.js'
  // },
  // resolve: {
  //   extensions: ['.js', '.jsx', '.json']
  // },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    devtool: 'source-map',
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    plugins: [
      myPreloadPlug
    ]
  },
  chainWebpack(config) {
    // when there are many pages, it will cause too many meaningless requests
    // config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'Dai Hoc Tai Nguyen Moi Truong'	// Replace your title here
        return args
      })
    // config.plugin('HtmlWebpackPlugin').use(myHtmlPlug)
    // config.plugin('PreloadWebpackPlugin').use(myPreloadPlug)

    // // it can improve the speed of the first screen, it is recommended to turn on preload
    // config.plugin('preload').tap(() => [
    //   {
    //     rel: 'preload',
    //     // to ignore runtime.js
    //     // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
    //     fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
    //     include: 'initial'
    //   }
    // ])

    // config.module
    //   .rule('vue')
    //   .test(/\.vue$/)
    //   .use('vue-loader')
    //   .loader('vue-loader')
    //   .end()

    config.module
      .rule('js')
      .test(/\.js$/)
      .use('babel-loader')
      .loader('babel-loader')
      .end()

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk('single')
    })
  }
}
