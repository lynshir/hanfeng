/**
 * 反向代理配置文件，主要解决用host需要手动刷新页面的问题
 * 当需要本地联调时修改target就可以
 * 参考文档 (https://github.com/chimurai/http-proxy-middleware）
 */
const proxy = require('http-proxy-middleware');
const target = 'https://dap103.runscm.com';
// const target = 'http://172.16.22.251:80';
const context = ['/api', '/sku', '/employee', '/category', '/baseSerializeSchema', '/brand', '/base', '/shop', '/warehouse', '/courier', '/city', '/district', '/province', '/organization', '/oms'];
module.exports = function (app) {
  context.forEach((pathPrefix) => {
    app.use(
      proxy.createProxyMiddleware(pathPrefix, {
        changeOrigin: true,
        target,
        secure: false,
      })
    );
  });
};
