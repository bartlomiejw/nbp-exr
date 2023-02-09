import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import checker from 'vite-plugin-checker'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import prismjs from 'vite-plugin-prismjs'
import copy from 'rollup-plugin-copy'
import {resolve} from 'path'
import ElementPlus from 'unplugin-element-plus/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'
import path from 'path'


// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '~': resolve(__dirname, ''),
            'vue': 'vue/dist/vue.esm-bundler.js',
        },
    },
    css: {
        postcss: {
            plugins: [
                require('autoprefixer'),
                require('tailwindcss'),
                require('postcss-import'),
                {
                    //remove build charset warning
                    postcssPlugin: 'internal:charset-removal',
                    AtRule: {
                        charset: (atRule) => {
                            if (atRule.name === 'charset') {
                                atRule.remove()
                            }
                        },
                    },
                },
            ],
        },
        preprocessorOptions: {
            //define global scss variable
            scss: {
                additionalData: `@use "@/admin/assets/admin.scss" as *;`,
            },
        },
    },
    plugins: [
        vue(),

        AutoImport({
            imports: [
                // presets
                'vue',
                'vue-router',
                {'element-plus/es': ['ElMessage']},
            ],
            resolvers: [ElementPlusResolver()],
            // Generate corresponding .eslintrc-auto-import.json file.
            // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
            eslintrc: {
                enabled: true, // Default `false`
                filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
                globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
            },
        }),
        Components({
            dts: true,
            directoryAsNamespace: true,
            globalNamespaces: ['layout'],
            dirs: ['src/admin/layout', 'src/admin/components', 'src/frontend/layout', 'src/frontend/components', 'src/frontend/layout', 'src/frontend/components'],
            resolvers: [ElementPlusResolver()],
        }),
        // createSvgIconsPlugin({
        //   // config svg dir that can config multi
        //   iconDirs: [
        //     path.resolve(process.cwd(), 'src/icons/common'),
        //     path.resolve(process.cwd(), 'src/icons/nav-bar'),
        //   ],
        //   // appoint svg icon using mode
        //   symbolId: 'icon-[dir]-[name]',
        // }),
        ElementPlus({
            useSource: true,
        }),
        prismjs({
            languages: ['log'],
            theme: 'twilight',
            css: true,
        }),
        checker({
            vueTsc: true,
        }),
        copy({
            targets: [
                {src: 'src/admin/admin.html', dest: 'public/'},
                {src: 'src/frontend/frontend.html', dest: 'public/'},
            ]
        })
    ],
    build: {
        manifest: true,
        outDir: 'public',
        assetsDir: 'assetsDIR',
        // publicDir: 'public',
        emptyOutDir: true, // delete the contents of the output directory before each build

        // https://rollupjs.org/guide/en/#big-list-of-options
        rollupOptions: {
            input: [
                'src/admin/admin.ts',
                'src/frontend/frontend.ts',
                // 'src/style.scss',
                // 'src/assets'
            ],
            output: {
                chunkFileNames: 'js/[name].js',
                entryFileNames: 'js/[name].js',

                assetFileNames: ({name}) => {
                    if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')){
                        return 'images/[name][extname]';
                    }

                    if (/\.css$/.test(name ?? '')) {
                        return 'css/[name][extname]';
                    }

                    // default value
                    // ref: https://rollupjs.org/guide/en/#outputassetfilenames
                    return '[name][extname]';
                },
            },
        },
    },
})
