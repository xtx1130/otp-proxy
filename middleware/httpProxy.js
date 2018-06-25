'use strict'

const rp = require('request-promise-native')
const tough = require('tough-cookie')
const url = require('url')

const Cookie = tough.Cookie

exports = module.exports = async function (ctx, next) {
  let uri = ctx.request.url
  let res
  let options = {
    uri: uri,
    headers: ctx.request.header,
    encoding: null,
    resolveWithFullResponse: true
  }
  let urlParse = url.parse(uri)
  if (process.env.NODE_ENV === 'test') {
    urlParse.host = 'http://localhost:8011'
    options.uri = url.format(urlParse)
  } else if(process.env.NODE_ENV === 'benchmark') {
    urlParse.host = 'http://www.baidu.com'
    options.uri = url.format(urlParse)
  }
  if (ctx.request.header.cookie) {
    let cookie = Cookie.parse(ctx.request.header.cookie)
    let cookiejar = new tough.CookieJar()
    await new Promise((resolve, reject) => {
      try {
        cookiejar.setCookie(cookie, ctx.header.host, () => {
          resolve()
        })
      } catch (e) {
        reject(e)
      }
    })
  }
  try {
    options.method = ctx.request.method
    let timer = process.hrtime()
    if (ctx.request.method === 'GET') {
      res = await rp(options)
    } else if (ctx.request.method === 'POST') {
      if (ctx.request.type === 'application/json') {
        options.json = true
      } else if (ctx.request.type === 'application/x-www-form-urlencoded') {
        ctx.request.body && (options.form = ctx.request.body)
      }
      res = await rp(options)
    }
    console.log(`网络开销：${process.pid}`, process.hrtime(timer))
  } catch (e) {
    throw new Error(e)
  }
  if (res.statusCode === 200) {
    for (let i in res.headers) {
      ctx.set(i, res.headers[i])
    }
    if (ctx.request.type === 'application/json')
      ctx.set('Content-type','application/com.ess.lxca-v3.0.91+json')
    ctx.set('X-Content-Type-Options','nosniff')
    ctx.set('server', 'tb-FE-mockServer')
  } else {
    ctx.status = res.statusCode
  }
  ctx.finalRes = res.body
  await next()
  ctx.body = ctx.finalRes
  console.log(process.hrtime(ctx.timers))
}
