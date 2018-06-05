'use strict'

const http = require('http')
const Koa = require('koa')
const KoaRouter =  require('koa-router')
const bodyParser = require('koa-bodyparser')
const httpProxy = require('./middleware/httpProxy')
const mock = require('./middleware/mock')
const error = require('./middleware/error')
const socketProxy = require('./middleware/socketProxy')

let httpApp = new Koa()
let approuter = new KoaRouter()

httpApp.use(error)
httpApp.use(bodyParser())
httpApp.use(httpProxy)
httpApp.use(mock)

let httpServer = http.createServer(httpApp.callback())
httpServer.on('connect',socketProxy)
httpServer.listen('8888',() => {
  console.log('http server is running at 8888')
})

exports = module.exports = httpServer