'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

function resolve (dir) {
  return path.resolve(__dirname, '..', dir)
}

module.exports = {
  base: {
    name: 'v-chacheli',
    entry:{
      example: './example/index.js'
    },
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'v-chacheli/dist/ChacheliDesigner$': resolve('./src/Designer.vue'),
      'v-chacheli/dist/ChacheliLayout$': resolve('./src/Layout.vue'),

      'v-chacheli/dist/ChacheliDesigner.css$': 'empty-module',
      'v-chacheli/dist/ChacheliLayout.css$': 'empty-module'
    }
  },

  dev: {
    assetsSubDirectory: 'example',
    assetsPublicPath: '/',
    proxyTable: {},

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'example',
    assetsPublicPath: '',
    productionSourceMap: true,
    devtool: '#source-map',
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },

  lib: {
    entry:{
      // everything in one
      'v-chacheli': './src/lib.js',

      // split packages for designer/layout
      'ChacheliDesigner': './src/Designer.vue',
      'ChacheliLayout': './src/Layout.vue'
    },

    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: '',
    assetsPublicPath: '/',
    productionSourceMap: true,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
