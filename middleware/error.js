'use strict'
const log = require('@xtx1130/tb-log')

exports = module.exports = async function (ctx, next) {
  try {
    await next()
  } catch (e) {
    console.log(e)
    ctx.status = 404
    log.error(e.message)
    ctx.body = e.message
  }
}
