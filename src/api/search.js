import jsonp from 'common/js/jsonp';
import { commonParams, options } from './config';

/**
 * 获取搜索热词
 */
export function getHotKey () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';
  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    _: 1531114453182
  });
  return jsonp(url, data, options);
}

/**
 * 根据用户输入的keyword查询
 */
export function getSuggestList (keyword, page, zhida, perpage) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';
  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    w: keyword,
    zhidaqu: 1,
    catZhida: zhida,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: perpage,
    n: perpage,
    p: page,
    remoteplace: 'txt.mqq.all',
    _: 1531117370025
  });
  return jsonp(url, data, options);
}
