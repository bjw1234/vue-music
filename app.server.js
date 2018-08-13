const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

const port = 8713;
const ip = '0.0.0.0';

let apiRouter = express.Router();
app.use('/api', apiRouter);

// 推荐列表
app.get('/api/desclist', (req, res) => {
  let url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(response => {
    res.json(response.data);
  }).catch(err => {
    res.end(err);
  });
});
// 歌词
app.get('/api/lyrics', (req, res) => {
  let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric.fcg';
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(response => {
    let reg = /^\w+\(({.+})\)$/;
    if (typeof response.data === 'string') {
      let matches = response.data.match(reg);
      res.json(JSON.parse(matches[1]));
    }
  }).catch(err => {
    res.end(err);
  });
});
// 推荐页歌单
app.get('/api/desc_song', (req, res) => {
  let url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';
  axios.get(url, {
    headers: {
      Referer: `https://y.qq.com/n/yqq/playlist/${req.query.dissid}.html`
    },
    params: req.query
  }).then(response => {
    res.json(response.data);
  }).catch(err => {
    res.end(err);
  });
});
// 获取关键词搜索信息
app.get('/api/key_search',(req,res) => {
  let url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';
  axios.get(url, {
    headers: {
      origin: 'https://y.qq.com',
  referer: 'https://y.qq.com/m/index.html'
    },
    params: req.query
  }).then(response => {
    res.json(response.data);
  }).catch(err => {
    res.end(err);
  });
});

// 静态文件托管
app.use(express.static(path.join(__dirname, '/dist')));

app.listen(port, ip, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('app is running at port:' + port);
});
