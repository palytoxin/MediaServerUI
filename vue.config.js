module.exports = {
  devServer: {
    proxy: {
      '/bpi': {                                //   以'/bpi'开头的请求会被代理进行转发
        target: 'http://localhost:801/index/api',       //   要发向的后台服务器地址  如果后台服务跑在后台开发人员的机器上，就写成 `http://ip:port` 如 `http:192.168.12.213:8081`   ip为后台服务器的ip
        changeOrigin: true                     
      }
    }
  }
}