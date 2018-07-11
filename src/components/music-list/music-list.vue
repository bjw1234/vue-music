<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgStyle" ref="image">
      <div class="filter" ref="filter"></div>
      <div class="play-wrapper">
        <div class="play" ref="play" v-if="songs.length>0" @click="clickRandomPlayAll">
          <span class="icon-play"></span>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <div class="scroll-layer" ref="layer"></div>
    <scroll @scroll="scrollList" :probe-type="3"
            :listen-scroll="true" :data="songs"
            class="scroll" ref="scroll">
      <div class="song-list-wrapper">
        <song-list @select_song="selectSongItem" :songs="songs" :rank="rank"></song-list>
      </div>
      <div class="loading-container" v-if="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';
  import SongList from 'base/song-list/song-list';
  import Loading from 'base/loading/loading';
  import { prefixStyle } from 'common/js/dom';
  import { mapActions } from 'vuex';
  import { playListMixin } from 'common/js/mixin';
  // CSS属性
  const transform = prefixStyle('transform');
  const backdrop = prefixStyle('backdrop-filter');
  // 标题的高度
  const TOP_HEIGHT = 40;

  export default {
    mixins: [playListMixin],
    components: {
      Scroll, SongList, Loading
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      bgImage: {
        type: String,
        default: ''
      },
      rank: {
        type: Boolean,
        default: false
      },
      songs: {
        type: Array,
        default: null
      }
    },
    data () {
      return {
        scrollY: 0
      };
    },
    watch: {
      scrollY (newY) {
        let layer = this.$refs.layer;
        let maxTranslateY = (this.imageHeight - TOP_HEIGHT) / -1;
        let translateY = Math.max(maxTranslateY, newY);
        layer.style[transform] = `translate3d(0,${translateY}px,0)`;
        // 修改图片的层级和高度
        let image = this.$refs.image;
        let play = this.$refs.play;
        if (maxTranslateY > newY) {
          image.style['z-index'] = 10;
          image.style['padding-top'] = 0;
          image.style['height'] = `${TOP_HEIGHT}px`;
          play.style.display = 'none';
        } else {
          image.style['z-index'] = null;
          image.style['padding-top'] = null;
          image.style['height'] = null;
          play.style.display = '';
        }
        if (newY > 0) {
          // 下拉放大图片
          let scale = 1 + Math.abs(newY / this.imageHeight);
          this.$refs.image.style[transform] = `scale(${scale})`;
        } else {
          // 上推背景模糊
          let percent = Math.abs(newY / this.imageHeight);
          let blur = Math.min(20, percent * 20);
          this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
        }
      }
    },
    mounted () {
      // 顶部图片的高度
      this.imageHeight = this.$refs.image.clientHeight;
      this.$refs.scroll.$el.style.top = `${this.imageHeight}px`;
      this.$refs.layer.style.top = `${this.imageHeight}px`;
    },
    computed: {
      bgStyle () {
        return `background-image:url(${this.bgImage})`;
      }
    },
    methods: {
      back () {
        this.$router.back();
      },
      scrollList (pos) {
        this.scrollY = pos.y;
      },
      selectSongItem (song, index) {
        this.selectPlay({
          list: this.songs,
          index
        });
      },
      clickRandomPlayAll () {
        this.randomPlayAll({
          list: this.songs
        });
      },
      // 解决播放器遮挡列表的问题
      handlePlayList (list) {
        let bottom = list.length > 0 ? '60px' : 0;
        this.$refs.scroll.$el.style.bottom = bottom;
        this.$refs.scroll.refresh();
      },
      ...mapActions([
        'selectPlay',
        'randomPlayAll'
      ])
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable";

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
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
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)

      .play-wrapper
        position: absolute
        bottom: 20px
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
    .scroll-layer
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      height: 100%
      background: $color-background
    .scroll
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        width: 100%
</style>
