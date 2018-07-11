import jsonp from 'common/js/jsonp';
import { commonParams, options } from './config';
import axios from 'axios';

/**
 * 获取轮播图数据
 */
export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });
  return jsonp(url, data, options);
}

/**
 * 获取推荐列表数据
 */
// export function getDescList () {
//   const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';
//   const data = Object.assign({}, commonParams, {
//     platform: 'yqq',
//     uin: 0,
//     needNewCode: 0,
//     hostUin: 0,
//     format: 'jsonp',
//     data: '{"comm":{"ct":24},"new_song":{"module":"QQMusic.MusichallServer","method":"GetNewSong","param":{"type":0}}}'
//   });
//   return jsonp(url, data, {
//     param: 'callback'
//   });
// }

export function getDescList () {
  const data = Object.assign({}, commonParams, {
    rnd: Math.random(),
    hostUin: 0,
    notice: 0,
    format: 'json',
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29
  });

  return axios.get('/api/desclist', {
    params: data
  });
}

/**
 * 获取推荐详情歌单
 */
export function getRecommendDescSong (dissid) {
  // https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?
  // type=1&json=1&utf8=1&onlysong=0&disstid=4196537346&format=jsonp&g_tk=5381&
  // jsonpCallback=playlistinfoCallback&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&
  // outCharset=utf-8&notice=0&platform=yqq&needNewCode=0
  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    onlysong: 0,
    disstid: dissid,
    hostUin: 0,
    loginUin: 0,
    notice: 0,
    format: 'json',
    platform: 'yqq',
    needNewCode: 0
  });

  return axios.get('/api/desc_song', {
    params: data
  });
}
