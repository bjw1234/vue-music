import storage from './storage/storage';

const searchKey = '__SEARCH_HISTORY__';
const searchHistoryLen = 10;

const playKey = '__PLAY_HISTORY__';
const playHistoryLen = 200;

const likeKey = '__LIKE_SONG_LIST__';
const likeSongListLen = 200;

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
// 保存搜索历史
export function saveSearch (query) {
  let arr = storage.get(searchKey, []);
  insertArr(arr, query, (item) => {
    return item === query;
  }, searchHistoryLen);
  // 插入localStorage
  storage.set(searchKey, arr);
  return arr;
}

// 保存播放历史
export function savePlay (song) {
  let arr = storage.get(playKey, []);
  insertArr(arr, song, (item) => {
    return item.id === song.id;
  }, playHistoryLen);
  storage.set(playKey, arr);
  return arr;
}

// 保存喜爱歌曲
export function saveLike (song) {
  let arr = storage.get(likeKey, []);
  arr.unshift(song);
  let maxLen = likeSongListLen;
  if (maxLen && arr.length > maxLen) {
    arr.pop();
  }
  storage.set(likeKey, arr);
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

// 删除喜爱的歌曲
export function deleteLike (song) {
  let arr = storage.get(likeKey);
  let index = arr.findIndex((item) => {
    return item.id === song.id;
  });
  arr.splice(index, 1);
  // 重新保存数据
  storage.set(likeKey, arr);
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
export function getSearchHistory () {
  return storage.get(searchKey, []);
}

export function getPlayHistory () {
  return storage.get(playKey, []);
}

export function getLikeSongList () {
  return storage.get(likeKey, []);
}
