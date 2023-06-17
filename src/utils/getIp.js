// 获取 IPv4 地址,适用于 linux 系统
exports.getIp = function () {
  const interfaces = require('os').networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // 判断是否为 IPv4 地址
      if (iface.family === 'IPv4') {
        if (name.startsWith('enp0')) {
          return iface.address
        }
      }
    }
  }
  return '127.0.0.1'
}
