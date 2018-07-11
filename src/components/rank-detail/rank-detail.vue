<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage" :rank="rank"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex';
  import { createSong } from 'common/js/song';
  import { ERR_OK } from 'api/config';
  import MusicList from 'components/music-list/music-list';
  import { getTopListDetail } from 'api/rank';

  export default {
    components: {
      MusicList
    },
    computed: {
      ...mapGetters([
        'topListDetail'
      ]),
      title () {
        return this.topListDetail.topTitle;
      },
      bgImage () {
        if (!this.songs.length) {
          return '';
        }
        return this.songs[0].image;
      }
    },
    data () {
      return {
        songs: [],
        rank: true
      };
    },
    created () {
      this._getTopListDetail();
    },
    methods: {
      _getTopListDetail () {
        if (this.topListDetail.id === undefined) {
          this.$router.back();
          return;
        }
        // 获取topid
        let topid = this.topListDetail.id;
        getTopListDetail(topid).then(res => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeMusicList(res.songlist);
          }
        });
      },
      _normalizeMusicList (list) {
        // 数据处理
        let ret = [];
        list.forEach(item => {
          let musicData = item.data;
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData));
          }
        });
        return ret;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable";

  .slide-enter-active, &.slide-leave-active
    transition: transform .3s

  .slide-enter, &.slide-leave-to
    transform: translate3d(100%, 0, 0)

</style>
