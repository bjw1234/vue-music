// 对mutation进行封装，或者执行一些异步操作

import * as types from './mutation-types';
import { disorder } from '../common/js/util';
import { playMode } from '../common/js/config';
import { saveSearch, deleteSearch, clearSearch } from '../common/js/cache';

function _findIndex (list, song) {
  return list.findIndex(item => {
    if (item) {
      return item.id === song.id;
    }
  });
}

export const selectPlay = ({commit, state}, {list, index}) => {
  commit(types.SET_SEQUENCELIST, list);
  if (state.mode === playMode.random) {
    let randomList = disorder(list);
    commit(types.SET_PLAYLIST, randomList);
    commit(types.SET_CURRENTINDEX, _findIndex(randomList, list[index]));
  } else {
    commit(types.SET_PLAYLIST, list);
    commit(types.SET_CURRENTINDEX, index);
  }

  commit(types.SET_PLAYING_STATE, true);
  commit(types.SET_FULLSCREEN_STATE, true);
};

export const randomPlayAll = ({commit, state}, {list, index}) => {
  commit(types.SET_SEQUENCELIST, list);
  commit(types.SET_PLAYLIST, disorder(list));
  commit(types.SET_MODE, playMode.random);
  commit(types.SET_CURRENTINDEX, 0);
  commit(types.SET_PLAYING_STATE, true);
  commit(types.SET_FULLSCREEN_STATE, true);
};

// 插入一首歌
export const insertSong = ({commit, state}, song) => {
  let playList = state.playList.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  // 如果当前播放列表为空
  if (!playList.length || !sequenceList.length) {
    commit(types.SET_SEQUENCELIST, [song]);
    commit(types.SET_PLAYLIST, [song]);
    commit(types.SET_CURRENTINDEX, 0);
    commit(types.SET_MODE, playMode.sequence);
  } else {
    // 当前正在播放的歌曲
    let currentSong = playList[currentIndex];
    // 判断当前播放的歌曲中是否有待插入的歌曲
    let fpindex = _findIndex(playList, song);
    currentIndex++;
    if (fpindex > -1) { // 交换
      [playList[currentIndex], playList[fpindex]] = [playList[fpindex], playList[currentIndex]];
    } else { // 插入
      playList.splice(currentIndex, 0, song);
    }
    // 处理顺序列表
    // 找到当前正在播放的歌曲对应的顺序列表的下标
    let seqindex = _findIndex(sequenceList, currentSong);
    // 找到待插入的歌曲在顺序列表中的下标
    let fsindex = _findIndex(sequenceList, song);
    seqindex++;
    if (fsindex > -1) {
      [sequenceList[seqindex], sequenceList[fsindex]] = [sequenceList[fsindex], sequenceList[seqindex]];
    } else {
      sequenceList.splice(seqindex, 0, song);
    }
    // 去除掉undefined的值
    playList = playList.filter(item => {
      if (item) {
        return item;
      }
    });
    sequenceList = sequenceList.filter(item => {
      if (item) {
        return item;
      }
    });

    // 提交修改
    let i = _findIndex(playList, song);
    commit(types.SET_CURRENTINDEX, i);
    commit(types.SET_PLAYLIST, playList);
    commit(types.SET_SEQUENCELIST, sequenceList);
  }
  // 打开播放器
  commit(types.SET_PLAYING_STATE, true);
  commit(types.SET_FULLSCREEN_STATE, true);
};

// 删除一首歌
export const deleteSong = ({commit, state}, song) => {
  let playList = state.playList.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  let fpindex = playList.findIndex((item) => {
    return song.id === item.id;
  });
  let fsindex = sequenceList.findIndex((item) => {
    return song.id === item.id;
  });
  playList.splice(fpindex, 1);
  sequenceList.splice(fsindex, 1);
  if (currentIndex > fpindex || currentIndex === playList.length) {
    currentIndex--;
  }
  // 提交修改
  commit(types.SET_CURRENTINDEX, currentIndex);
  commit(types.SET_PLAYLIST, playList);
  commit(types.SET_SEQUENCELIST, sequenceList);
  if (!playList.length) {
    commit(types.SET_PLAYING_STATE, false);
  } else {
    commit(types.SET_PLAYING_STATE, true);
  }
};

export const deleteSongAll = ({commit}) => {
  commit(types.SET_PLAYLIST, []);
  commit(types.SET_SEQUENCELIST, []);
  commit(types.SET_PLAYING_STATE, false);
  commit(types.SET_CURRENTINDEX, -1);
};

// 插入一条历史数据
export const insertHistory = ({commit}, data) => {
  commit(types.SET_SEARCH_HISTORY, saveSearch(data));
};

// 删除一条历史
export const deleteHistory = ({commit}, data) => {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(data));
};

// 清空所有历史数据
export const clearHistory = ({commit}) => {
  commit(types.SET_SEARCH_HISTORY, clearSearch());
};
