// 对mutation进行封装，或者执行一些异步操作

import * as types from './mutation-types';

export const selectPlay = ({commit, state}, {list, index}) => {
  commit(types.SET_PLAYLIST, list);
  commit(types.SET_SEQUENCELIST, list);
  commit(types.SET_CURRENTINDEX, index);
  commit(types.SET_PLAYING_STATE, true);
  commit(types.SET_FULLSCREEN_STATE, true);
};
