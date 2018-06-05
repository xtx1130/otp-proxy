# otp-proxy
> otp代理接口方案，目前otp环境的js部署方案已经比较成熟，修改之后可以进行快速替换。但是在联调的时候，如果接口复杂度较高，需要对接口各种情况进行联调判断，操作起来比较麻烦。

## 使用方式
- 在工作目录下安装`otp-proxy`包：
```shell
$ npm install git+http://gitlab.baidu.com/xietianxin/otp-proxy.git
```

- 在`package.json`的`npm scripts`中添加：
```json
// package.json
"scripts": {
  "proxy": "otproxy"
}
```

- 在浏览器中使用`SwitchyOmega`配置网页代理，把http代理指向到`127.0.0.1:8888`，**https不要配置，目前尚不支持https代理**

- 在项目根目录下添加配置文件`proxy-data.js`:
```js
// proxy-data.js
exports = module.exports = {
  // key 为要代理的path, value为async函数，其中res为请求返回的body内容
  'mo/q/generalplat/generalPlat': async res => {
      res = JSON.parse(res)
      res.data.has_more = 0 //可直接指定修改返回内容中的某个键值对
      res.data.head.show_style = 2
      return res //最后返回res给中间件
  }
}
```
在发起对`mo/q/generalplat/generalPlat`的请求时候，会走如上逻辑，修改部分键值再进行返回。

## API 接入
```js
let server = require('otp-proxy') //server为代理服务器，是http.Server的实例
server.close() //关闭代理服务器
```