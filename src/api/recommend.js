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
    // headers: {
    //   referer: 'https://c.y.qq.com/',
    //   host: 'c.y.qq.com'
    // },
    params: data
  });
}
