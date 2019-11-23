const {
  addLessLoader,
  addWebpackExternals,
  override,
  addBundleVisualizer,
  addWebpackModuleRule,
  babelExclude,
} = require('customize-cra')
const path = require('path')
const setWebpackTargetPlugin = config => {
  config.target = 'electron-renderer'
  return config
}
if (process.env.NODE_ENV === 'production') {
  process.env.REACT_APP_CONTENT_SECURITY_POLICY = `
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src * data: filesystem:; media-src * data: filesystem:"
/>
`
} else {
  process.env.REACT_APP_CONTENT_SECURITY_POLICY = ''
}

const setPublicPathPlugin = config => {
  if (config.output) {
    config.output.publicPath = ''
  } else {
    config.output = { publicPath: '' }
  }
  return config
}
const svgPath = path.resolve('src/icons/svg')
const webpackMaker = override(
  addLessLoader({
    javascriptEnabled: true,
  }),
  addWebpackExternals((context, request, callback) => {
    if (
      ['iconv-lite', 'feedparser', 'custom-electron-titlebar'].includes(request)
    ) {
      return callback(null, 'commonjs ' + request)
    }
    callback()
  }),
  addBundleVisualizer({}, true),
  setWebpackTargetPlugin,
  setPublicPathPlugin,
  babelExclude([svgPath]),
  addWebpackModuleRule({
    test: /\.svg$/,
    loader: 'svg-sprite-loader',
    include: [svgPath],
    options: {
      symbolId: 'icon-[name]',
    },
  })
)

module.exports = {
  webpack: webpackMaker,
  jest: function(config) {
    config.runner = '@jest-runner/electron'
    config.testEnvironment = '@jest-runner/electron/environment'
    config.coveragePathIgnorePatterns = [
      '<rootDir>/build/',
      '<rootDir>/main/',
      '<rootDir>/node_modules/',
    ]
    return config
  },
}
