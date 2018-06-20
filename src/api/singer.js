import jsonp from 'common/js/jsonp';
import { commonParams, options } from './config';

// 获取歌手信息
export function getSinger () {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';
  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    data: JSON.stringify({
      'comm': {'ct': 24, 'cv': 10000},
      'singerList': {
        'module': 'Music.SingerListServer',
        'method': 'get_singer_list',
        'param': {'area': -100, 'sex': -100, 'genre': -100, 'index': -100, 'sin': 0, 'cur_page': 1}
      }
    })
  });
  return jsonp(url, data, {
    param: 'callback'
  });
}

// 获取歌曲信息
export function getSingerDetail (id) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';
  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    format: jsonp,
    notice: 0,
    platform: 'yqq',
    singermid: id,
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1
  });
  return jsonp(url, data, options);
}

// 获取某个歌曲的vkey
export function getSongVkey (songmid) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg';
  const data = Object.assign({}, commonParams, {
    g_tk: 195219765,
    hostUin: 0,
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    songmid: songmid,
    filename: `C400${songmid}.m4a`,
    guid: 3009522126
  });
  return jsonp(url, data, {
    param: 'callback'
  });
}

// 获取歌曲的url
export function getSongURL (songmid, vkey) {
  let url = `http://dl.stream.qqmusic.qq.com/C400${songmid}.m4a?vkey=${vkey}&guid=3009522126&uin=0&fromtag=66`;
  return url;
}
