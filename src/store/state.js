import { playMode } from 'common/js/config';
import { getSearchHistory, getPlayHistory, getLikeSongList } from 'common/js/cache';

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
  searchHistory: getSearchHistory(),
  // 播放历史
  playHistory: getPlayHistory(),
  // 喜爱歌曲列表
  likeSongList: getLikeSongList(),
  // 是否全屏
  screenState: false
};

export default state;
