'use strict'

exports = module.exports = async function(ctx, next){
  try {
    await next()
  } catch (e) {
    ctx.status = 404
    console.log(e)
    ctx.body = e.message
  }
}