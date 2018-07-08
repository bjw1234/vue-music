// 对mutation进行封装，或者执行一些异步操作

import * as types from './mutation-types';
import { disorder } from '../common/js/util';
import { playMode } from '../common/js/config';

function _findIndex (list, song) {
  return list.findIndex(item => {
    return item.id === song.id;
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
