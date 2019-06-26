const path = require('path');
const axios = require('axios')
const bodyParser = require('body-parser')

function resolve(dir) {
  return path.join(__dirname, '', dir);
}

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        api: resolve('src/api'),
        base: resolve('src/base'),
        common: resolve('src/common'),
        components: resolve('src/components'),
      },
    },
  },
  devServer: {
    before(app) {
      app.post('/api/getPurlUrl', bodyParser.json(), function (req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.post(url, req.body, {
          headers: {
            referer: 'https://y.qq.com/',
            origin: 'https://y.qq.com',
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.warn(e)
        })
      })
    }
  }
};
