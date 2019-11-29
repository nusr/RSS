const path = require('path')
function setExternal(name) {
  return (context, request, callback) => {
    if (request === name) {
      return callback(null, 'commonjs ' + request)
    }
    callback()
  }
}
module.exports = {
  context: path.resolve(__dirname),
  devtool: 'source-map',
  entry: './index.ts',
  externals: [setExternal('electron-is-dev'), setExternal('electron-updater')],
  mode: 'production',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
    ],
  },
  node: {
    __dirname: false,
  },
  output: {
    filename: 'electron.js',
    path: path.resolve(__dirname, '../public'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  target: 'electron-main',
}
