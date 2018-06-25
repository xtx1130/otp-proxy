'use strict'

const rp = require('request-promise-native')

let res = rp({
  method: 'GET',
  uri: 'http://localhost:8888/'
})
for(let i = 0; i<25 ;i ++){
    let res = rp({
      method: 'GET',
      uri: 'http://localhost:8888/'
    })
    res.end()
}
setTimeout(function(){
    for(let i = 0;i<25;i++){
      let res = rp({
        method: 'GET',
        uri: 'http://localhost:8888/'
      })
      res.end()
    }
},0)