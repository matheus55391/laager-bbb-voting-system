const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin')
const { NxReactWebpackPlugin } = require('@nx/react/webpack-plugin')
const { join } = require('path')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/web'),
  },
  devServer: {
    port: 4200,
    historyApiFallback: {
      index: '/index.html',
      disableDotRule: true,
      htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
    },
    hot: true,
    liveReload: true,
  },
  watch: !isProduction,
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 300,
    ignored: /node_modules/,
  },
  plugins: [
    new NxAppWebpackPlugin({
      tsConfig: './tsconfig.app.json',
      compiler: 'babel',
      main: './src/main.tsx',
      index: './src/index.html',
      baseHref: '/',
      assets: ['./src/favicon.ico', './src/assets'],
      // styles: [`${__dirname}/src/app/globals.css`],
      styles: [`${__dirname}/src/app/index.css`],
      outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
      optimization: process.env['NODE_ENV'] === 'production',
    }),
    new NxReactWebpackPlugin({
      // Uncomment this line if you don't want to use SVGR
      // See: https://react-svgr.com/
      // svgr: false
    }),
  ],
}
