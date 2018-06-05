'use strict'
const log = require('tb-log')

exports = module.exports = async function(ctx, next){
  try {
    await next()
  } catch (e) {
    ctx.status = 404
    log.error(e.message)
    ctx.body = e.message
  }
}