// 用于更改状态（state中的数据）
import * as types from './mutation-types';

const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer;
  },
  [types.SET_PLAYING_STATE] (state, flag) {
    state.playing = flag;
  },
  [types.SET_FULLSCREEN_STATE] (state, flag) {
    state.fullScreen = flag;
  },
  [types.SET_PLAYLIST] (state, list) {
    state.playList = list;
  },
  [types.SET_SEQUENCELIST] (state, list) {
    state.sequenceList = list;
  },
  [types.SET_MODE] (state, mode) {
    state.mode = mode;
  },
  [types.SET_CURRENTINDEX] (state, index) {
    state.currentIndex = index;
  },
  [types.SET_RECOMMEND_DESC] (state, desc) {
    state.recommendDesc = desc;
  },
  [types.SET_TOPLIST_DETAIL] (state, detail) {
    state.topListDetail = detail;
  },
  [types.SET_SEARCH_HISTORY] (state, history) {
    state.searchHistory = history;
  },
  [types.SET_PLAY_HISTORY] (state, history) {
    state.playHistory = history;
  },
  [types.SET_LIKE_SONGLIST] (state, list) {
    state.likeSongList = list;
  },
  [types.SET_SCREEN_STATE] (state, flag) {
    state.screenState = flag;
  }
};

export default mutations;
