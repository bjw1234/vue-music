<template>
  <div class="rank" ref="rank">
    <scroll class="top-list" :data="topList" ref="topListHook">
      <ul>
        <li @click="selectItem(item)" class="item" v-for="item in topList" :key="item.id">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl" alt="">
          </div>
          <ul class="song-list">
            <li class="song" v-for="(song,index) in item.songList" :key="index">
              <span>{{ index + 1 }}</span>
              <span>{{song.songname}} - {{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <div class="loading-wrapper">
      <loading v-if="!topList.length"></loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getTopList } from 'api/rank';
  import { ERR_OK } from '../../api/config';
  import Loading from 'base/loading/loading';
  import Scroll from 'base/scroll/scroll';
  import { playListMixin } from 'common/js/mixin';
  import { mapMutations } from 'vuex';

  export default {
    mixins: [playListMixin],
    components: {
      Loading, Scroll
    },
    created () {
      this._getTopList();
    },
    data () {
      return {
        topList: []
      };
    },
    methods: {
      selectItem (item) {
        this.$router.push({
          path: `rank/${item.id}`
        });
        this.setTopListDetail(item);
      },
      _getTopList () {
        getTopList().then(res => {
          if (res.code === ERR_OK) {
            this.topList = res.data.topList;
            console.log(this.topList);
          }
        });
      },
      handlePlayList (playlist) {
        let bottom = playlist.length ? '60px' : 0;
        this.$refs.rank.style.bottom = bottom;
        this.$refs.topListHook.refresh();
      },
      ...mapMutations({
        setTopListDetail: 'SET_TOPLIST_DETAIL'
      })
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .top-list
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        height: 100px
        padding-top: 20px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
        .song-list
          flex: 1
          display: flex
          padding: 0 20px
          height: 100px
          overflow: hidden
          flex-direction: column
          justify-content: center
          color: $color-text-d
          font-size: $font-size-small
          background: $color-highlight-background
          .song
            no-wrap()
            line-height: 26px
    .loading-wrapper
      position: absolute
      top: 50%
      width: 100%
      transform: translateY(-50%)
</style>
