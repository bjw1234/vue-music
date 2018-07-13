// 对获取状态的一个封装
export const singer = state => state.singer;
export const playing = state => state.playing;
export const fullScreen = state => state.fullScreen;
export const playList = state => state.playList;
export const sequenceList = state => state.sequenceList;
export const mode = state => state.mode;
export const currentIndex = state => state.currentIndex;
export const currentSong = state => {
  return state.playList[state.currentIndex] || {};
};
export const recommendDesc = state => state.recommendDesc;
export const topListDetail = state => state.topListDetail;
export const searchHistory = state => state.searchHistory;
export const playHistory = state => state.playHistory;
export const likeSongList = state => state.likeSongList;

export const screenState = state => state.screenState;
