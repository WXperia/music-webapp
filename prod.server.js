var express = require('express')
var compression = require('compression')
var config = require('./config/index')
var axios = require('axios')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var csrf = require('xsrf')

var port = process.env.PORT || config.build.port

var app = express()

var csrfProtection = csrf({
  cookie: true,
  ignoreMethods: ['HEAD', 'OPTIONS'],
  checkPathReg: /^\/api/
})
app.use(cookieParser())
app.use(csrfProtection)

var apiRoutes = express.Router()

apiRoutes.get('/getDiscList', csrfProtection, function (req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

apiRoutes.get('/getCdInfo', csrfProtection, function (req, res) {
  var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({.+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})

apiRoutes.get('/lyric', csrfProtection, function (req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({.+})\)$/
      var matches = response.data.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})

apiRoutes.post('/getPurlUrl', bodyParser.json(), csrfProtection, function (req, res) {
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
    console.log(e)
  })
})

apiRoutes.get('/search', csrfProtection, function (req, res) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

app.get('/api/getTopBanner', function (req, res) {
  console.log(1111)
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  const jumpPrefix = 'https://y.qq.com/n/yqq/album/'

  axios.get(url, {
    headers: {
      referer: 'https://u.y.qq.com/',
      host: 'u.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    response = response.data
    if (response.code === 0) {
      const slider = []
      const content = response.focus.data && response.focus.data.content
      if (content) {
        for (let i = 0; i < content.length; i++) {
          const item = content[i]
          const sliderItem = {}
          sliderItem.id = item.id
          sliderItem.linkUrl = jumpPrefix + item.jump_info.url + '.html'
          sliderItem.picUrl = item.pic_info.url
          slider.push(sliderItem)
        }
      }
      res.json({
        code: 0,
        data: {
          slider
        }
      })
    } else {
      res.json(response)
    }
  }).catch((e) => {
    console.log(e)
  })
})

app.use('/api', apiRoutes)

app.get('/', function (req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken())
  return next()
})

app.use(compression())

app.use(express.static('./dist'))

app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next()
  }

  // handle CSRF token errors here
  res.status(403)
  res.send('<p>接口已经被我用 CSRF 保护了，请参考课程用自己的服务器代理接口</p><p>如果你还未购买课程并想学习课程的话，请去慕课网购买<a href="https://coding.imooc.com/class/107.html">正版课程</a>，不仅可以学到很多硬货知识，更有机会加我微信喔~</p><p>课程项目<a href="http://ustbhuangyi.com/music">体验地址</a>，也可扫码访问</p><img src="data:image/png;base64,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"></img>')
})

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
