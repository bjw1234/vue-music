import storage from './storage/storage';

const searchKey = '__SEARCH_HISTORY__';
const searchHistoryLen = 10;

function insertArr (arr, val, compare, maxLen) {
  let index = arr.findIndex(compare);
  if (index === 0) {
    return;
  }
  if (index > 0) {
    arr.splice(index, 1);
    arr.unshift(val);
  }
  if (index < 0) {
    arr.unshift(val);
  }
  if (maxLen && arr.length > maxLen) {
    arr.pop();
  }
}

/**
 * 插入localStorage
 * @param query
 */
export function saveSearch (query) {
  let arr = storage.get(searchKey, []);
  insertArr(arr, query, (item) => {
    return item === query;
  }, searchHistoryLen);
  // 插入localStorage
  storage.set(searchKey, arr);
  return arr;
}

/**
 * 删除一条数据
 * @param query
 * @return {V|*}
 */
export function deleteSearch (query) {
  let arr = storage.get(searchKey);
  let index = arr.findIndex((item) => {
    return item === query;
  });
  arr.splice(index, 1);
  // 重新设置数据
  storage.set(searchKey, arr);
  return arr;
}

/**
 * 清空搜索列表
 * @return {Array}
 */
export function clearSearch () {
  storage.removeAll();
  return [];
}

/**
 * 获取localStorage中的数据
 */
export function getHistory () {
  return storage.get(searchKey);
}
