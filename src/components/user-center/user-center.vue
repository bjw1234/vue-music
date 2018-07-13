<template>
  <transition name="slide">
    <div class="user-center">
      <div class="header">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">用户中心</h1>
      </div>
      <div class="switch-wrapper">
        <switches :switches="switches"
                  :switchIndex="switchIndex"
                  @switchSelect="switchSelect">
        </switches>
      </div>
      <div class="content-wrapper" ref="content">
        <div v-if="switchIndex===0">
          <div class="play" ref="play" v-if="likeSongList.length>0" @click="clickRandomPlayAll">
            <span class="icon-play"></span>
            <span class="text">随机播放全部</span>
          </div>
          <div class="scroll-wrapper" ref="scrollWrapper">
            <scroll class="scroll"
                    ref="songList"
                    :data="likeSongList"
                    :refreshDelay="refreshDelay">
              <song-list :songs="likeSongList" @select_song="selectSong"></song-list>
            </scroll>
          </div>
        </div>
        <div v-if="switchIndex===1" class="introduce">
          <ul class="content">
            <li class="item">姓名：佐佐木</li>
            <li class="item">
              <div class="txt">项目在线演示地址：</div>
              <a href="http://music.baijiawei.top">http://music.baijiawei.top</a>
            </li>
            <li class="item">
              <div class="txt">源码地址：</div>
              <a href="https://github.com/bjw1234/vue-music">https://github.com/bjw1234/vue-music</a>
            </li>
            <li class="item">
              <div class="txt">segmentfault社区地址：</div>
              <a href="https://segmentfault.com/u/zuozuomu">https://segmentfault.com/u/zuozuomu</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Switches from 'base/switches/switches';
  import SongList from 'base/song-list/song-list';
  import Scroll from 'base/scroll/scroll';
  import { playListMixin } from 'common/js/mixin';
  import { Song } from 'common/js/song';
  import { mapGetters, mapActions } from 'vuex';
  import { requestFullScreen } from 'common/js/util';

  export default {
    mixins: [playListMixin],
    components: {
      Switches, SongList, Scroll
    },
    computed: {
      ...mapGetters([
        'likeSongList'
      ])
    },
    data () {
      return {
        switchIndex: 0,
        switches: [
          {
            name: '收藏的歌曲'
          }, {
            name: '关于开发者'
          }
        ],
        refreshDelay: 300
      };
    },
    methods: {
      back () {
        this.$router.back();
      },
      switchSelect (index) {
        this.switchIndex = index;
      },
      handlePlayList (list) {
        let bottom = (list && list.length > 0) ? '60px' : 0;
        this.$refs.content.style.bottom = bottom;
        this.$refs.songList && this.$refs.songList.refresh();
      },
      selectSong (song, index) {
        this.selectPlay({
          list: this._normalizeSongs(),
          index
        });
      },
      clickRandomPlayAll () {
        // 全屏补丁
        requestFullScreen();
        this.$store.commit('SET_SCREEN_STATE', true);
        this.randomPlayAll({
          list: this._normalizeSongs()
        });
      },
      _normalizeSongs () {
        let ret = [];
        this.likeSongList.forEach(item => {
          ret.push(new Song(item));
        });
        return ret;
      },
      ...mapActions([
        'selectPlay',
        'randomPlayAll'
      ])
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .user-center
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 100
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translateX(100%)
    .header
      height: 44px
      text-align: center
      .back
        position: absolute
        top: 0
        left: 6px
        z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-style: $font-size-large-x
        color: $color-theme
      .title
        line-height: 40px
        color: $color-text
        font-size: $font-size-large
    .switch-wrapper
      margin: 0 0 20px
    .content-wrapper
      position: absolute
      top: 92px
      bottom: 0
      width: 100%
      overflow: hidden
      box-sizing: border-box
      padding: 0 30px 20px
      .play
        box-sizing: border-box
        width: 135px
        padding: 7px 0
        margin: 0 auto
        text-align: center
        border: 1px solid $color-text
        color: $color-text
        border-radius: 100px
        font-size: 0
        .icon-play
          display: inline-block
          vertical-align: middle
          margin-right: 6px
          color: $color-text
          font-size: $font-size-medium-x
        .text
          display: inline-block
          vertical-align: middle
          font-size: $font-size-small
      .scroll-wrapper
        position: absolute
        top: 52px
        bottom: 0
        overflow: hidden
        .scroll
          height: 100%
      .introduce
        display: flex
        height: 100%
        justify-content: center
        .content
          text-align: center
          .item
            margin: 40px 20px
            .txt
              color: $color-text
              line-height: 30px
</style>
