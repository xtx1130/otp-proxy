'use strict'

// const easyMonitor = require('easy-monitor')
// easyMonitor('otp-proxy')
const http = require('http')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const log = require('@xtx1130/tb-log')
const httpProxy = require('./middleware/httpProxy')
const mock = require('./middleware/mock')
const error = require('./middleware/error')
const socketProxy = require('./middleware/socketProxy')
const compress = require('koa-compress')

let httpApp = new Koa()
httpApp.use(compress({
  filter: function (content_type) {
    return /text/i.test(content_type)
  },
  flush: require('zlib').Z_SYNC_FLUSH
}))
httpApp.use((ctx, next) => {
  ctx.timers = process.hrtime()
  return next()
})
httpApp.use(error)
httpApp.use(bodyParser())
httpApp.use(httpProxy)
httpApp.use(mock)

let httpServer = http.createServer(httpApp.callback())
httpServer.on('connect',socketProxy)
httpServer.listen('8888',() => {
  log.clear()
  log.info('proxy server is running at 8888')
})

exports = module.exports = httpServer