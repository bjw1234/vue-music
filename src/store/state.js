import { playMode } from 'common/js/config';

// 状态信息
const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1
};

export default state;
