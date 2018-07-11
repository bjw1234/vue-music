import { playMode } from 'common/js/config';
import { getHistory } from 'common/js/cache';

// 状态信息
const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  // 推荐列表item详情
  recommendDesc: {},
  // 排行榜列表item详情
  topListDetail: {},
  // 搜索历史数据
  searchHistory: getHistory()
};

export default state;
