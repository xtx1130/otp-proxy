'use strict'

const Koa = require('koa')
const net = require('net')
const http = require('http')
const KoaRouter = require('koa-router')
const bodyParser = require('koa-bodyparser')
const httpServer = require('../index.js')
const rp = require('request-promise-native')

const app = new Koa()
const router = new KoaRouter()

router.get('/test/testget', async function(ctx, next){
  ctx.body = ctx.request.query
})
router.post('/test/testpost', async function(ctx, next){
  ctx.body = JSON.stringify(ctx.request.body)
})
router.post('/test/testform', async function(ctx, next){
  ctx.body = JSON.stringify(ctx.request.body)
})

app.use(bodyParser())
app.use(router.routes())
let testServer = http.createServer(app.callback())
testServer.listen('8011')

let server = http.createServer()
server.on('connect', (req,socket,head) => {
  socket.write('response data')
  socket.pipe(socket)
  socket.on('data', data => {
    console.log(data,'asdasdasdadas')
    socket.write('response data')
  })
  socket.on('error', e => {
    console.log(e)
  })
})
server.listen('8012',() => {})
afterAll(() => {
  httpServer.close()
  testServer.close()
  server.close()
})
describe('Test for GET method', () => {
  it('Must successfully return res', async () => {
    let res = await rp({
      method:'GET',
      uri: 'http://localhost:8888/test/testget',
      qs: {
        testname: 'get test',
        testurl: 'test/testget'
      }
    })
    expect(/otp-proxy,get/.test(res)).toBe(true)
  })
})

describe('Test for POST method', () => {
  it('Must successfully return res', async () => {
    let res = await rp({
      method:'POST',
      uri: 'http://localhost:8888/test/testpost',
      body: {
        testname: 'post test',
        testurl: 'test/testpost'
      },
      json: true
    })
    expect(/otp-proxy,post/.test(res.testurl)).toBe(true)
  })
})

describe('Test for POST/FORM method', () => {
  it('Must successfully return res', async () => {
    let res = await rp({
      method:'POST',
      uri: 'http://localhost:8888/test/testform',
      form: {
        testname: 'post test',
        testurl: 'test/testform'
      }
    })
    expect(/otp-proxy,form/.test(res)).toBe(true)
  })
})

// const req = http.request({
//   port: 8888,
//   hostname: '127.0.0.1',
//   method: 'CONNECT',
//   path: '/test/socket'
// })
// req.on('connect', (res, socket, head) => {
//   socket.write('socket pipe establish successfully')
//   socket.on('data', function(data) {
//     console.log('DATA: ' + data)
//   })
//   socket.on('end', function() {
//     console.log('Connection closed')
//   })
// })
// req.end()

