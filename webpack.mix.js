const fs = require('fs')
const path = require('path')
const mix = require('laravel-mix')
const webpack = require('webpack')
const StylelintPlugin = require('stylelint-webpack-plugin')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const ElementPlus = require('unplugin-element-plus/webpack')

require('laravel-mix-tailwind')

const webpackConfig = {
  externals: {
    'jquery': 'jQuery',
    'vue': 'Vue'
  },
  plugins: [
    /**
     * Stylelint
     *
     * @link https://github.com/webpack-contrib/stylelint-webpack-plugin
     */
    new StylelintPlugin({
      context: './assets',
      files: '**/*.css',
      fix: true,
    }),
    AutoImport({
      imports: [
        // presets
        'vue',
        'vue-router',
        'pinia',
        { 'element-plus/es': ['ElMessage'] },
      ],
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    ElementPlus({
      useSource: true,
    }),
  ],
  resolve: {
    extensions: ['.js', '.json', '.vue', '.sass', '.scss', '.ts'],
    alias: {
      '~src': path.resolve(__dirname, 'src'),
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  stats: {
    children: true
  },
  devServer: {
    port: 31337   // in case your port 8080 and 31337 are taken, replace this
  }
}

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */
mix.setPublicPath('public/')

mix.ts('src/admin/admin.ts', 'js')
  .vue({
    version: 3,
    extractStyles: true
  })

mix.ts('src/frontend/frontend.ts', 'js')
  .vue({
    version: 3,
    extractStyles: true
  })

mix.ts('src/frontview/frontview.ts', 'js')
  .vue({
    version: 3,
    extractStyles: true
  })

// bare minimum packages: ['core-js', 'vue-router', '@vue/devtools-api']
mix.extract() // empty to extract all


const postcssPlugins = [
  require('autoprefixer'),
  require('postcss-import'),
  require('postcss-preset-env')({ stage: 1 }),
  require('postcss-pxtorem')({
    propList: ['*'],
    selectorBlackList: ['border'],
    mediaQuery: true,
  })
]

mix.options({
    postCss: postcssPlugins
  })
  .postCss(
    'src/assets/admin.css',
    'css'
  )
  .postCss(
    'src/assets/frontend.css',
    'css'
  )
  .postCss(
    'src/assets/frontview.css',
    'css'
  )

// mix.sass('src/assets/admin.scss', 'css', {
//   outputStyle: 'nested'
// });
//
// mix.sass('src/assets/frontend.scss', 'css', {
//   outputStyle: 'nested'
// });
//
// mix.sass('src/assets/frontview.scss', 'css', {
//   outputStyle: 'nested'
// });

mix.tailwind().version()

if (mix.inProduction()) {
  mix.sourceMaps()
}

mix.after(() => {
  let manifest = JSON.parse(
    fs.readFileSync('./public/mix-manifest.json').toString()
  )

  let adminHtml    = fs.readFileSync('./src/assets/admin.html').toString()
  let frontendHtml = fs.readFileSync('./src/assets/frontend.html').toString()
  let frontviewHtml = fs.readFileSync('./src/assets/frontview.html').toString()
  for (let path of Object.keys(manifest)) {
    adminHtml    = adminHtml.replace(path.replace(/^\//, ''), manifest[path].replace(/^\//, ''))
    frontendHtml = frontendHtml.replace(path.replace(/^\//, ''), manifest[path].replace(/^\//, ''))
    frontviewHtml = frontviewHtml.replace(path.replace(/^\//, ''), manifest[path].replace(/^\//, ''))
  }

  fs.writeFileSync('./public/admin.html', adminHtml)
  fs.writeFileSync('./public/frontend.html', frontendHtml)
  fs.writeFileSync('./public/frontview.html', frontviewHtml)
})

mix.webpackConfig(webpackConfig)
  .browserSync({
    serveStatic: ['./'],
    serveStaticOptions: {
      extensions: ['html'] // don't need to provide html extension, this create pretty urls
    }
  })

mix.override((config) => {
  config.watchOptions = {
    ignored: [
      '**/node_modules/**',
      '**/public/**',
      '**/vendor/**'
    ]
  }
})
