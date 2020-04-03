import sirv from 'sirv'
import polka from 'polka'
import compression from 'compression'
import * as sapper from '@sapper/server'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

// TODO: get rid of proxy on production mode

const proxy = require('http-proxy-middleware')('/api', {
  target: 'http://localhost:3030',
  changeOrigin: true,
  pathRewrite: { '^/api': '/' },
})

polka() // You can also use Express
  .use(
    proxy,
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    sapper.middleware()
  )
  .listen(PORT, err => {
    if (err) console.log('Error: ', err)
  })
