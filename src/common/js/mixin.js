import { mapGetters, mapMutations } from 'vuex';
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
      'sequenceList'
    ])
  },
  methods: {
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
      setPlayList: 'SET_PLAYLIST'
    })
  }
};
