<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import musicList from 'components/music-list/music-list';
  import { getRecommendDescSong } from 'api/recommend';
  import { mapGetters } from 'vuex';
  import { ERR_OK } from '../../api/config';
  import { createSong } from 'common/js/song';

  export default {
    created () {
      this._getSongList();
    },
    data () {
      return {
        songs: []
      };
    },
    methods: {
      _getSongList () { // 获取歌单
        if (!this.recommendDesc.dissid) {
          this.$router.back();
        }
        let disstid = this.recommendDesc.dissid;
        getRecommendDescSong(disstid).then((res) => {
          if (res && res.data && res.data.code === ERR_OK) {
            let list = res.data.cdlist[0].songlist;
            list.forEach(item => {
              if (item.songid && item.albummid) {
                this.songs.push(createSong(item));
              }
            });
          }
        });
      }
    },
    computed: {
      title () {
        return this.recommendDesc.dissname;
      },
      bgImage () {
        return this.recommendDesc.imgurl;
      },
      ...mapGetters([
        'recommendDesc'
      ])
    },
    components: {
      musicList
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
