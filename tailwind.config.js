module.exports = {
  mode: 'jit',
  content: [
    './public/index.html',
    './public/admin.html',
    './public/frontend.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
    './public/css/*.{css,scss}',
  ],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        white: '#ffffff',
        primary: '#0052cc',
        success: '#67c23a',
        warning: '#e6a23c',
        error: '#f56c6c',
        textColor: '#0b1527'
      }
    }
  },
  variants: {
    appearance: []
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
}
