import originJSONP from 'jsonp';

/**
 * 做一个简单的jsonp封装
 * @param url
 * @param data
 * @param option
 * @return {Promise}
 */
export default function jsonp (url, data, option) {
  return new Promise((resolve, reject) => {
    url = `${url}?${_obj2String(data)}`;
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
};

function _obj2String (obj, arr = [], index = 0) {
  let params = [];
  for (let key in obj) {
    params.push(`${key}=${obj[key]}`);
  }
  return params.join('&');
}
