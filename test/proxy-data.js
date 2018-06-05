'use strict'

exports = module.exports = {
    'mo/q/generalplat/generalPlat': async res => {
        res = JSON.parse(res)
        res.data.has_more = 0
        return res
    },
    '/test/testget': async res => {
        res = JSON.parse(res)
        res.testurl = 'change by otp-proxy,get'
        return res
    },
    '/test/testpost': async res => {
        res = JSON.parse(res)
        res.testurl = 'change by otp-proxy,post'
        return res
    },
    '/test/testform': async res => {
        res = JSON.parse(res)
        res.testurl = 'change by otp-proxy,form'
        return res
    },
    '/test/socket': async data => {
        data = data.toString()
        data = 'change by otp-proxy,socket'
        return data
    }
}