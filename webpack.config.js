{
  mode: 'production',
  context: 'D:\\TECHCOMBANK\\daihoctnmt',
  devtool: false,
  output: {
    hashFunction: 'xxhash64',
    path: 'D:\\TECHCOMBANK\\daihoctnmt\\dist',
    filename: 'js/[name].[contenthash:8].js',
    publicPath: '',
    chunkFilename: 'js/[name].[contenthash:8].js'
  },
  resolve: {
    alias: {
      '@': 'D:\\TECHCOMBANK\\daihoctnmt\\src',
      vue$: 'vue/dist/vue.runtime.esm.js'
    },
    extensions: [
      '.mjs',
      '.js',
      '.jsx',
      '.vue',
      '.json',
      '.wasm'
    ],
    modules: [
      'node_modules',
      'D:\\TECHCOMBANK\\daihoctnmt\\node_modules',
      'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules'
    ]
  },
  resolveLoader: {
    modules: [
      'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-plugin-babel\\node_modules',
      'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\lib\\config\\vue-loader-v15-resolve-compat',
      'node_modules',
      'D:\\TECHCOMBANK\\daihoctnmt\\node_modules',
      'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules'
    ]
  },
  module: {
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
    rules: [
      /* config.module.rule('esm') */
      {
        test: /\.m?jsx?$/,
        resolve: {
          fullySpecified: false
        }
      },
      /* config.module.rule('vue') */
      {
        test: /\.vue$/,
        use: [
          /* config.module.rule('vue').use('vue-loader') */
          {
            loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules\\@vue\\vue-loader-v15\\lib\\index.js',
            options: {
              compilerOptions: {
                whitespace: 'condense'
              }
            }
          }
        ]
      },
      /* config.module.rule('vue-style') */
      {
        test: /\.vue$/,
        resourceQuery: /type=style/,
        sideEffects: true
      },
      /* config.module.rule('pug') */
      {
        test: /\.pug$/,
        oneOf: [
          /* config.module.rule('pug').oneOf('pug-vue') */
          {
            resourceQuery: /vue/,
            use: [
              /* config.module.rule('pug').oneOf('pug-vue').use('pug-plain-loader') */
              {
                loader: 'pug-plain-loader'
              }
            ]
          },
          /* config.module.rule('pug').oneOf('pug-template') */
          {
            use: [
              /* config.module.rule('pug').oneOf('pug-template').use('raw') */
              {
                loader: 'raw-loader'
              },
              /* config.module.rule('pug').oneOf('pug-template').use('pug-plain-loader') */
              {
                loader: 'pug-plain-loader'
              }
            ]
          }
        ]
      },
      /* config.module.rule('svg') */
      {
        test: /\.(svg)(\?.*)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name].[hash:8][ext]'
        },
        exclude: [
          'D:\\TECHCOMBANK\\daihoctnmt\\src\\icons'
        ]
      },
      /* config.module.rule('images') */
      {
        test: /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: 'img/[name].[hash:8][ext]'
        }
      },
      /* config.module.rule('media') */
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: 'media/[name].[hash:8][ext]'
        }
      },
      /* config.module.rule('fonts') */
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        type: 'asset',
        generator: {
          filename: 'fonts/[name].[hash:8][ext]'
        }
      },
      /* config.module.rule('css') */
      {
        test: /\.css$/,
        oneOf: [
          /* config.module.rule('css').oneOf('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule('css').oneOf('vue-modules').use('extract-css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '../'
                }
              },
              /* config.module.rule('css').oneOf('vue-modules').use('css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                    auto: () => true
                  }
                }
              },
              /* config.module.rule('css').oneOf('vue-modules').use('postcss-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('css').oneOf('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              /* config.module.rule('css').oneOf('vue').use('extract-css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '../'
                }
              },
              /* config.module.rule('css').oneOf('vue').use('css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('css').oneOf('vue').use('postcss-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('css').oneOf('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              /* config.module.rule('css').oneOf('normal-modules').use('extract-css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '../'
                }
              },
              /* config.module.rule('css').oneOf('normal-modules').use('css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('css').oneOf('normal-modules').use('postcss-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('css').oneOf('normal') */
          {
            use: [
              /* config.module.rule('css').oneOf('normal').use('extract-css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '../'
                }
              },
              /* config.module.rule('css').oneOf('normal').use('css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('css').oneOf('normal').use('postcss-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('postcss') */
      {
        test: /\.p(ost)?css$/,
        oneOf: [
          /* config.module.rule('postcss').oneOf('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule('postcss').oneOf('vue-modules').use('extract-css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '../'
                }
              },
              /* config.module.rule('postcss').oneOf('vue-modules').use('css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                    auto: () => true
                  }
                }
              },
              /* config.module.rule('postcss').oneOf('vue-modules').use('postcss-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('postcss').oneOf('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              /* config.module.rule('postcss').oneOf('vue').use('extract-css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '../'
                }
              },
              /* config.module.rule('postcss').oneOf('vue').use('css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('postcss').oneOf('vue').use('postcss-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('postcss').oneOf('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              /* config.module.rule('postcss').oneOf('normal-modules').use('extract-css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '../'
                }
              },
              /* config.module.rule('postcss').oneOf('normal-modules').use('css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('postcss').oneOf('normal-modules').use('postcss-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('postcss').oneOf('normal') */
          {
            use: [
              /* config.module.rule('postcss').oneOf('normal').use('extract-css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '../'
                }
              },
              /* config.module.rule('postcss').oneOf('normal').use('css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('postcss').oneOf('normal').use('postcss-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('scss') */
      {
        test: /\.scss$/,
        oneOf: [
          /* config.module.rule('scss').oneOf('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule('scss').oneOf('vue-modules').use('extract-css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '../'
                }
              },
              /* config.module.rule('scss').oneOf('vue-modules').use('css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                    auto: () => true
                  }
                }
              },
              /* config.module.rule('scss').oneOf('vue-modules').use('postcss-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule('scss').oneOf('vue-modules').use('sass-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\sass-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('scss').oneOf('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              /* config.module.rule('scss').oneOf('vue').use('extract-css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '../'
                }
              },
              /* config.module.rule('scss').oneOf('vue').use('css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('scss').oneOf('vue').use('postcss-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule('scss').oneOf('vue').use('sass-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\sass-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('scss').oneOf('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              /* config.module.rule('scss').oneOf('normal-modules').use('extract-css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '../'
                }
              },
              /* config.module.rule('scss').oneOf('normal-modules').use('css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('scss').oneOf('normal-modules').use('postcss-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule('scss').oneOf('normal-modules').use('sass-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\sass-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('scss').oneOf('normal') */
          {
            use: [
              /* config.module.rule('scss').oneOf('normal').use('extract-css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '../'
                }
              },
              /* config.module.rule('scss').oneOf('normal').use('css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('scss').oneOf('normal').use('postcss-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule('scss').oneOf('normal').use('sass-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\sass-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('sass') */
      {
        test: /\.sass$/,
        oneOf: [
          /* config.module.rule('sass').oneOf('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule('sass').oneOf('vue-modules').use('extract-css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '../'
                }
              },
              /* config.module.rule('sass').oneOf('vue-modules').use('css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                    auto: () => true
                  }
                }
              },
              /* config.module.rule('sass').oneOf('vue-modules').use('postcss-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule('sass').oneOf('vue-modules').use('sass-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\sass-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          },
          /* config.module.rule('sass').oneOf('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              /* config.module.rule('sass').oneOf('vue').use('extract-css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '../'
                }
              },
              /* config.module.rule('sass').oneOf('vue').use('css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('sass').oneOf('vue').use('postcss-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule('sass').oneOf('vue').use('sass-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\sass-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          },
          /* config.module.rule('sass').oneOf('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              /* config.module.rule('sass').oneOf('normal-modules').use('extract-css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '../'
                }
              },
              /* config.module.rule('sass').oneOf('normal-modules').use('css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('sass').oneOf('normal-modules').use('postcss-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule('sass').oneOf('normal-modules').use('sass-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\sass-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          },
          /* config.module.rule('sass').oneOf('normal') */
          {
            use: [
              /* config.module.rule('sass').oneOf('normal').use('extract-css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '../'
                }
              },
              /* config.module.rule('sass').oneOf('normal').use('css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('sass').oneOf('normal').use('postcss-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule('sass').oneOf('normal').use('sass-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\sass-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('less') */
      {
        test: /\.less$/,
        oneOf: [
          /* config.module.rule('less').oneOf('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule('less').oneOf('vue-modules').use('extract-css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '../'
                }
              },
              /* config.module.rule('less').oneOf('vue-modules').use('css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                    auto: () => true
                  }
                }
              },
              /* config.module.rule('less').oneOf('vue-modules').use('postcss-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule('less').oneOf('vue-modules').use('less-loader') */
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('less').oneOf('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              /* config.module.rule('less').oneOf('vue').use('extract-css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '../'
                }
              },
              /* config.module.rule('less').oneOf('vue').use('css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('less').oneOf('vue').use('postcss-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule('less').oneOf('vue').use('less-loader') */
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('less').oneOf('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              /* config.module.rule('less').oneOf('normal-modules').use('extract-css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '../'
                }
              },
              /* config.module.rule('less').oneOf('normal-modules').use('css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('less').oneOf('normal-modules').use('postcss-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule('less').oneOf('normal-modules').use('less-loader') */
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('less').oneOf('normal') */
          {
            use: [
              /* config.module.rule('less').oneOf('normal').use('extract-css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '../'
                }
              },
              /* config.module.rule('less').oneOf('normal').use('css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('less').oneOf('normal').use('postcss-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule('less').oneOf('normal').use('less-loader') */
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('stylus') */
      {
        test: /\.styl(us)?$/,
        oneOf: [
          /* config.module.rule('stylus').oneOf('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule('stylus').oneOf('vue-modules').use('extract-css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '../'
                }
              },
              /* config.module.rule('stylus').oneOf('vue-modules').use('css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                    auto: () => true
                  }
                }
              },
              /* config.module.rule('stylus').oneOf('vue-modules').use('postcss-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule('stylus').oneOf('vue-modules').use('stylus-loader') */
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('stylus').oneOf('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              /* config.module.rule('stylus').oneOf('vue').use('extract-css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '../'
                }
              },
              /* config.module.rule('stylus').oneOf('vue').use('css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('stylus').oneOf('vue').use('postcss-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule('stylus').oneOf('vue').use('stylus-loader') */
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('stylus').oneOf('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              /* config.module.rule('stylus').oneOf('normal-modules').use('extract-css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '../'
                }
              },
              /* config.module.rule('stylus').oneOf('normal-modules').use('css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('stylus').oneOf('normal-modules').use('postcss-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule('stylus').oneOf('normal-modules').use('stylus-loader') */
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('stylus').oneOf('normal') */
          {
            use: [
              /* config.module.rule('stylus').oneOf('normal').use('extract-css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '../'
                }
              },
              /* config.module.rule('stylus').oneOf('normal').use('css-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('stylus').oneOf('normal').use('postcss-loader') */
              {
                loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\@vue\\cli-service\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule('stylus').oneOf('normal').use('stylus-loader') */
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('js') */
      {
        test: /\.js$/,
        exclude: [
          function () { /* omitted long function */ }
        ],
        use: [
          /* config.module.rule('js').use('thread-loader') */
          {
            loader: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\thread-loader\\dist\\cjs.js'
          },
          /* config.module.rule('js').use('babel-loader') */
          {
            loader: 'babel-loader',
            options: {
              cacheCompression: false,
              cacheDirectory: 'D:\\TECHCOMBANK\\daihoctnmt\\node_modules\\.cache\\babel-loader',
              cacheIdentifier: '2b3eeb10'
            }
          }
        ]
      },
      /* config.module.rule('icons') */
      {
        test: /\.svg$/,
        include: [
          'D:\\TECHCOMBANK\\daihoctnmt\\src\\icons'
        ],
        use: [
          /* config.module.rule('icons').use('svg-sprite-loader') */
          {
            loader: 'svg-sprite-loader',
            options: {
              symbolId: 'icon-[name]'
            }
          }
        ]
      }
    ]
  },
  optimization: {
    realContentHash: false,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial'
        },
        elementUI: {
          name: 'chunk-elementUI',
          priority: 20,
          test: /[\\/]node_modules[\\/]_?element-ui(.*)/
        },
        commons: {
          name: 'chunk-commons',
          test: 'D:\\TECHCOMBANK\\daihoctnmt\\src\\components',
          minChunks: 3,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: 'single',
    minimizer: [
      /* config.optimization.minimizer('terser') */
      new TerserPlugin(
        {
          terserOptions: {
            compress: {
              arrows: false,
              collapse_vars: false,
              comparisons: false,
              computed_props: false,
              hoist_funs: false,
              hoist_props: false,
              hoist_vars: false,
              inline: false,
              loops: false,
              negate_iife: false,
              properties: false,
              reduce_funcs: false,
              reduce_vars: false,
              switches: false,
              toplevel: false,
              typeofs: false,
              booleans: true,
              if_return: true,
              sequences: true,
              unused: true,
              conditionals: true,
              dead_code: true,
              evaluate: true
            },
            mangle: {
              safari10: true
            }
          },
          parallel: true,
          extractComments: false
        }
      ),
      /* config.optimization.minimizer('css') */
      new CssMinimizerPlugin(
        {
          parallel: true,
          minimizerOptions: {
            preset: [
              'default',
              {
                mergeLonghand: false,
                cssDeclarationSorter: false
              }
            ]
          }
        }
      )
    ]
  },
  plugins: [
    /* config.plugin('vue-loader') */
    new VueLoaderPlugin(),
    /* config.plugin('define') */
    new DefinePlugin(
      {
        'process.env': {
          NODE_ENV: '"production"',
          VUE_APP_API_CATE: '"/cate"',
          VUE_APP_API_CATEGORY_COMMON: '"/category-common/search-schema-by-table-name-to-list"',
          VUE_APP_API_GATEWAY: '"http://18.143.12.86:8081/lab-management"',
          VUE_APP_API_KEY: '"19001000"',
          VUE_APP_API_VER: '"/v1"',
          VUE_APP_APP_CODE: '"HUNRE"',
          VUE_APP_BUTTON_PERMISSION: '"true"',
          VUE_APP_CONTEXT_ROOT: '"/"',
          VUE_APP_ENDPOINT_DEFAULT: '"/tainguyenmoitruong"',
          VUE_APP_FE_LIB: '"http://10.0.222.58/fe-lib/"',
          VUE_APP_HEADER: '"HUNRE"',
          VUE_APP_ZAMMAD: '"/gateway/zammad"',
          VUE_APP_ZAMMAD_ACTIVE: '"true"',
          BASE_URL: '""'
        }
      }
    ),
    /* config.plugin('case-sensitive-paths') */
    new CaseSensitivePathsPlugin(),
    /* config.plugin('friendly-errors') */
    new FriendlyErrorsWebpackPlugin(
      {
        additionalTransformers: [
          function () { /* omitted long function */ }
        ],
        additionalFormatters: [
          function () { /* omitted long function */ }
        ]
      }
    ),
    /* config.plugin('extract-css') */
    new MiniCssExtractPlugin(
      {
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].css'
      }
    ),
    /* config.plugin('html') */
    new HtmlWebpackPlugin(
      {
        title: 'Dai Hoc Tai Nguyen Moi Truong',
        scriptLoading: 'defer',
        templateParameters: function () { /* omitted long function */ },
        template: 'D:\\TECHCOMBANK\\daihoctnmt\\public\\index.html'
      }
    ),
    /* config.plugin('ScriptExtHtmlWebpackPlugin') */
    new (require('script-ext-html-webpack-plugin'))(
      {
        inline: /runtime\..*\.js$/
      }
    ),
    /* config.plugin('copy') */
    new CopyPlugin(
      {
        patterns: [
          {
            from: 'D:\\TECHCOMBANK\\daihoctnmt\\public',
            to: 'D:\\TECHCOMBANK\\daihoctnmt\\dist',
            toType: 'dir',
            noErrorOnMissing: true,
            globOptions: {
              ignore: [
                '**/.DS_Store',
                'D:/TECHCOMBANK/daihoctnmt/public/index.html'
              ]
            },
            info: {
              minimized: true
            }
          }
        ]
      }
    ),
    {
      options: {
        rel: 'preload',
        include: 'initial',
        excludeHtmlNames: [],
        fileBlacklist: [
          /\.map$/,
          /hot-update\.js$/,
          /runtime\..*\.js$/
        ]
      },
      webpackMajorVersion: 4
    }
  ],
  entry: {
    app: [
      './src/main.js'
    ]
  },
  name: 'HUNRE'
}
