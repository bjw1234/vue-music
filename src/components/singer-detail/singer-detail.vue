<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex';
  import { getSingerDetail } from 'api/singer';
  import { createSong } from 'common/js/song';
  import { ERR_OK } from 'api/config';
  import MusicList from 'components/music-list/music-list';

  export default {
    components: {
      MusicList
    },
    computed: {
      ...mapGetters([
        'singer'
      ]),
      title () {
        return this.singer.name;
      },
      bgImage () {
        return this.singer.avatar;
      }
    },
    data () {
      return {
        songs: []
      };
    },
    created () {
      this._getSingerDetail();
    },
    methods: {
      _getSingerDetail () {
        if (!this.singer.id) {
          this.$router.back();
          return;
        }
        getSingerDetail(this.singer.id).then(res => {
          if (res.code === ERR_OK) {
            let list = res.data.list;
            list.forEach(item => {
              let {musicData} = item;
              if (musicData.songid && musicData.albummid) {
                this.songs.push(createSong(musicData));
              }
            });
          }
        });
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
