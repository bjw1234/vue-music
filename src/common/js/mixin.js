import { mapGetters } from 'vuex';

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
