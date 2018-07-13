import { mapGetters, mapMutations, mapActions } from 'vuex';
import { playMode } from './config';
import { disorder } from 'common/js/util';

export const playListMixin = {
  mounted () {
    this.handlePlayList(this.playList);
  },
  activated () {
    this.handlePlayList(this.playList);
  },
  watch: {
    playList (newPlayList) {
      this.handlePlayList(newPlayList);
    }
  },
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  methods: {
    handlePlayList () {
      throw new Error('Components must implement handlePlayList method.');
    }
  }
};

export const playerMixin = {
  computed: {
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
    },
    ...mapGetters([
      'playList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList',
      'likeSongList'
    ])
  },
  methods: {
    iconFavorite (song) {
      if (this.isLikeSong(song)) {
        return 'icon-favorite';
      } else {
        return 'icon-not-favorite';
      }
    },
    toggleLike (song) {
      if (this.isLikeSong(song)) {
        this.deleteLikeSong(song);
      } else {
        this.saveLikeSong(song);
      }
    },
    isLikeSong (song) {
      let index = this.likeSongList.findIndex((item) => {
        return song.id === item.id;
      });
      return index >= 0;
    },
    changeMode () {
      let newMode = (this.mode + 1) % 3;
      this.setMode(newMode);
      let list = null;
      if (newMode === playMode.random) {
        list = disorder(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlayList(list);
    },
    resetCurrentIndex (list) {
      let index = 0;
      list.forEach((item, i) => {
        if (item.id === this.currentSong.id) {
          return (index = i);
        }
      });
      this.setCurrentIndex(index);
    },
    ...mapMutations({
      setFullScreen: 'SET_FULLSCREEN_STATE',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENTINDEX',
      setMode: 'SET_MODE',
      setSequenceList: 'SET_SEQUENCELIST',
      setPlayList: 'SET_PLAYLIST',
      setScreenState: 'SET_SCREEN_STATE'
    }),
    ...mapActions([
      'saveLikeSong',
      'deleteLikeSong'
    ])
  }
};

export const historyMixin = {
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  data () {
    return {
      query: ''
    };
  },
  methods: {
    suggestScroll () {
      // 让search-box失去焦点
      this.$refs.searchBox.blur();
    },
    saveQuery () {
      this.insertHistory(this.query);
    },
    onQueryChange (query) {
      this.query = query;
    },
    historyItemDelete (item) {
      this.deleteHistory(item);
    },
    historyItemSelect (item) {
      console.log(item);
      this.$refs.searchBox.setQuery(item);
    },
    onConfirmPositive () {
      this.clearHistory();
      this.$refs.confirm.hide();
    },
    showConfirm () {
      this.$refs.confirm.show();
    },
    ...mapActions([
      'insertHistory',
      'deleteHistory',
      'clearHistory'
    ])
  }
};
