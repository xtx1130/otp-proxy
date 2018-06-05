'use strict'

const path = require('path')
const assert = require('assert')
const log = require('tb-log')

exports = module.exports = async function (ctx, next) {
  let map, bodyStr
  try {
    map = require(path.join(process.cwd(), './proxy-data.js'))
  } catch (e) {
    throw new Error('Can\'t find proxy-data.js in project root directory')
  }

  await Promise.all([Object.keys(map).forEach(async key => {
    if (ctx.request.url.match(key)) {
      assert(typeof map[key] === 'function', 'proxy-data value must be an function')
      assert(map[key].constructor.name === 'AsyncFunction', 'proxy-data value must be an function')
      log.info(`${ctx.request.url} has proxyed by otp-proxy`)
      if (Object.prototype.toString.call(ctx.finalRes) === '[object Object]') { bodyStr = JSON.stringify(ctx.finalRes) } else { bodyStr = ctx.finalRes }
      ctx.finalRes = await map[key].call(null, bodyStr)
    }
  })])
  await next()
}
