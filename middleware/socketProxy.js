'use strict'

const fs = require('fs')
const net = require('net')
const log = require('tb-log')

let socketProxy = (req,socket,head) => {
  let uri = {
    host: req.headers.host.split(':')[0],
    port: req.headers.host.split(':')[1] || 5390,
  },
  headers = {
    'Connection': 'keep-alive',
    'Proxy-Agent': 'TBFE Proxy'
  }
  if(process.env.NODE_ENV !== 'test') {
    uri.path = req.url
  } else {
    uri.port = 8012
  }
  let socketConnect = net.createConnection(uri,() => {
    let cb = err => {
      if(err){
        log.error('request error:'+err.message)
        socketConnect.end()
        socket.end()
        throw new Error(err)
      }else{
        socketConnect.pipe(socket)
        socket.pipe(socketConnect)
      }
    }
    try{
      let status = 'HTTP/1.1 200 Connection established\r\n',
        headerLines = ''
      for(let key in headers)
        headerLines += key + ': ' + headers[key] + '\r\n'
      socket.write(status + headerLines + '\r\n', 'UTF-8', cb)
    }catch(e){
      log.error('socketConnect error:',+ e.message)
    }
  })
  socketConnect.setNoDelay(true)
  socketConnect.on('data', data => {
    log.info(data, '-----')
  })
  socketConnect.on('error', e => {
    log.error(e)
  })
}
exports = module.exports = socketProxy