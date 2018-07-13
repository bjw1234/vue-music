<template>
  <div class="player" v-show="playList.length > 0">
    <transition
      name="normal"
      @before-enter="beforeEnter"
      @enter="enters"
      @beforeLeave="beforeLeave"
      @leave="leave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" alt="">
        </div>
        <div class="top">
          <div @click="back" class="back"><i class="icon-back"></i></div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ currentSong.singer }}</h2>
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleLeft">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdRotate">
                <img :src="currentSong.image" alt="" class="image">
              </div>
            </div>
            <div class="lyric-wrapper">
              {{currentPlayingLyric}}
            </div>
          </div>
          <scroll ref="lyricScroll" class="middle-r" :data="currentLyrics && currentLyrics.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyrics&&currentLyrics.lines">
                <p ref="lyricLine" class="txt"
                   :class="{'current':currentLineNum === index}"
                   v-for="(line,index) in currentLyrics.lines" :key="index">
                  {{ line.txt }}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentMiddleShow === 'cd'}"></span>
            <span class="dot" :class="{'active':currentMiddleShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ format(currentSongTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="percentChange"></progress-bar>
            </div>
            <span class="time time-r">{{ format(currentSong.duration) }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i @click="changeMode" :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableClz">
              <i @click="prevSong" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableClz">
              <i @click="togglePlaying" :class="normalPlayIcon"></i>
            </div>
            <div class="icon i-right" :class="disableClz">
              <i @click="nextSong" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i @click="toggleLike(currentSong)" :class="iconFavorite(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdRotate" width="40" height="40" :src="currentSong.image" alt="" ref="miniCD">
        </div>
        <div class="text">
          <h2 class="name">{{ currentSong.name }}</h2>
          <p class="desc">{{ currentSong.singer }}</p>
        </div>
        <div class="control">
          <progress-circle :radius="circleRadius" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniPlayIcon"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist" @click.stop="showPlayList"></i>
        </div>
      </div>
    </transition>
    <play-list ref="playList"></play-list>
    <audio ref="audio" :src="currentSongUrl"
           @canplay="songCanPlay"
           @error="songError"
           @ended="songEnd"
           @timeupdate="updateTime">
    </audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import Velocity from 'velocity-animate';
  import { playMode } from 'common/js/config';
  import { mapGetters, mapActions } from 'vuex';
  import Scroll from 'base/scroll/scroll';
  import progressBar from 'base/progress-bar/progress-bar';
  import progressCircle from 'base/progress-circle/progress-circle';
  import LyricParser from 'lyric-parser';
  import { prefixStyle } from 'common/js/dom';
  import PlayList from 'components/playlist/playlist';
  import { playerMixin } from 'common/js/mixin';

  const TRANSFORM = prefixStyle('transform');
  const TRANSITION = prefixStyle('transition');

  export default {
    mixins: [playerMixin],
    components: {
      progressBar, progressCircle, Scroll, PlayList
    },
    data () {
      return {
        circleRadius: 32,
        currentSongUrl: '',
        currentLineNum: 0,
        currentLyrics: null,
        currentSongReady: false,
        currentSongTime: 0,
        currentPlayingLyric: '',
        currentMiddleShow: 'cd'
      };
    },
    computed: {
      cdRotate () {
        return this.playing ? 'play' : 'play pause';
      },
      normalPlayIcon () {
        return this.playing ? 'icon-pause' : 'icon-play';
      },
      miniPlayIcon () {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
      },
      disableClz () {
        return this.currentSongReady ? '' : 'disable';
      },
      percent () {
        return this.currentSongTime / this.currentSong.duration;
      },
      ...mapGetters([
        'fullScreen'
      ])
    },
    watch: {
      currentSong (newSong, oldSong) {
        if (!newSong || !newSong.id) {
          return;
        }
        if (newSong.id === oldSong.id) {
          return;
        }
        // 初始化
        if (this.currentLyrics) {
          this.currentLineNum = 0;
          this.currentLyrics.stop();
          this.currentLyrics = null;
          this.currentPlayingLyric = '';
        }
        newSong.getSongUrl().then(url => {
          this.currentSongUrl = url;
        }).then(() => {
          this.getSongLyric();
        }).catch(err => {
          console.log(err);
          this.currentSongReady = true;
        });
      },
      currentSongUrl () {
        this.$nextTick(() => {
          this.$refs.audio.play();
        });
      },
      playing (newState) {
        setTimeout(() => {
          let audio = this.$refs.audio;
          if (newState) {
            audio.play();
          } else {
            audio.pause();
          }
        }, 500);
      }
    },
    created () {
      this.touch = {};
      // 屏幕宽度
      this.touch.screenW = parseInt(document.documentElement.clientWidth);
    },
    methods: {
      back () {
        this.setFullScreen(false);
      },
      open () {
        this.setFullScreen(true);
      },
      beforeEnter () {
        let cd = this.$refs.cdWrapper;
//        let {x, y, scale} = this.getPosAndScale();
//        cd.style[TRANSFORM] = `translateX(${-x}px)`;
//        cd.style[TRANSFORM] = `translateY(${y}px)`;
//        cd.style[TRANSFORM] = `scale(${scale})`;
//        cd.style.transform.translateX = `${-x}px`;
//        cd.style.transform.translateY = `${y}px`;

        cd.style.opacity = 0;
//
//        console.log(cd);
//        Velocity(cd, {
//          opacity: 0,
//          scale: 0.1
//        });
      },
      enters (el, done) {
        let cd = this.$refs.cdWrapper;
//        let {x, y, scale} = this.getPosAndScale();
//        cd.style.transition = 'all 0.4s';
//        cd.style[TRANSFORM] = 'translate3d(0,0,0) scale(1)';
//        cd.style.opacity = 1;
//        cd.addEventListener('transitioned', done);
//        console.log('enter');

        Velocity(cd, {
          opacity: 1
        }, {duration: 400, complete: done});
      },
      beforeLeave () {
//        let cd = this.$refs.cdWrapper;
//        Velocity(cd, {
//          translateX: `${x}px`,
//          translateY: `${-y}px`,
//          scale: 1
//        }, {duration: 400});
      },
      leave (el, done) {
        let cd = this.$refs.cdWrapper;
//        let {x, y, scale} = this.getPosAndScale();
//        Velocity(cd, {
//          translateX: `${-x}px`,
//          translateY: `${y}px`,
//          scale: scale
//        }, {duration: 400, complete: done});
        Velocity(cd, {
          opacity: 0
        }, {duration: 400, complete: done});
      },
      getPosAndScale () {
        let screenWidth = document.documentElement.clientWidth;
        let screenHeight = document.documentElement.clientHeight;
        let normalCDW = screenWidth * 0.8;
        let normalCDTop = 85;
        let miniCDW = 40;
        let miniCDPaddingLeft = 20;
        let miniCDPaddingBottom = 10;
        let x = screenWidth / 2 - miniCDW / 2 - miniCDPaddingLeft;
        let y = screenHeight - normalCDTop - normalCDW / 2 - miniCDPaddingBottom - miniCDW / 2;
        let scale = miniCDW / normalCDW;
        console.log(miniCDW, normalCDW, scale);
        return {
          x, y, scale
        };
      },
      togglePlaying () {
        this.setPlayingState(!this.playing);
        // toggle歌词
        if (this.currentLyrics) {
          this.currentLyrics.togglePlay();
        }
      },
      prevSong () {
        if (this.playList.length === 1) {
          return;
        }
        this.currentSongTime = 0;
        if (!this.currentSongReady) {
          return;
        }
        if (this.currentLyrics) {
          this.currentLyrics.stop();
        }
        let index = this.currentIndex;
        if (index === 0) {
          index = this.playList.length;
        }
        this.currentSongReady = false;
        this.setCurrentIndex(--index);
        if (!this.playing) {
          this.togglePlaying();
        }
      },
      nextSong () {
        if (this.playList.length === 1) {
          return;
        }
        this.currentSongTime = 0;
        if (!this.currentSongReady) {
          return;
        }
        if (this.currentLyrics) {
          this.currentLyrics.stop();
        }
        let index = this.currentIndex;
        if (index === this.playList.length - 1) {
          index = -1;
        }
        this.setCurrentIndex(++index);
        this.currentSongReady = false;
        if (!this.playing) {
          this.togglePlaying();
        }
      },
      songCanPlay () {
        this.currentSongReady = true;
        this.savePlayHistory(this.currentSong);
      },
      songError () {
        console.log('audio歌曲发生错误...');
        if (this.currentLyrics) {
          this.currentLyrics.stop();
        }
        this.currentSongReady = true;
      },
      songEnd () {
        if (this.mode === playMode.loop) {
          let audio = this.$refs.audio;
          audio.currentTime = 0;
          audio.play();
          // 歌词回到起始位置
          if (this.currentLyrics) {
            this.currentLyrics.seek(0);
          }
          return;
        }
        this.nextSong();
      },
      updateTime (e) {
        if (this.currentSongReady) {
          this.currentSongTime = e.target.currentTime;
        }
      },
      format (interval) {
        let minutes = interval / 60 | 0;
        let seconds = this._pad(interval % 60 | 0);
        return `${minutes}:${seconds}`;
      },
      _pad (num, len = 2) {
        let length = num.toString().length;
        while (length < len) {
          num = '0' + num;
          length++;
        }
        return num;
      },
      percentChange (percent) {
        let audio = this.$refs.audio;
        let songlen = this.currentSong.duration;
        audio.currentTime = percent * songlen;
        // 设置歌词的位置
        if (this.currentLyrics) {
          this.currentLyrics.seek(percent * songlen * 1000);
        }
        if (!this.playing) {
          // fix lyrics bug
          this.currentLyrics.togglePlay();
          this.togglePlaying();
        }
      },
      getSongLyric () {
        this.currentSong.getLyrics().then(lyrics => {
          if (this.currentSong.lyrics !== lyrics) {
            return;
          }
          // 初始化歌词对象和回调
          if (this.currentLyrics) {
            this.currentLyrics.stop();
          }
          this.currentLyrics = new LyricParser(lyrics, ({lineNum, txt}) => {
            this.currentLineNum = lineNum;
            this.currentPlayingLyric = txt;
            if (lineNum > 5) {
              let elements = this.$refs.lyricLine;
              this.$refs.lyricScroll.scrollToElement(elements[lineNum - 5], 1000);
            } else {
              this.$refs.lyricScroll.scrollTo(0, 0, 1000);
            }
          });
          this.currentLyrics.play();
        });
      },
      middleTouchStart (e) {
        this.touch.initaled = true;
        let touch = e.touches[0];
        this.touch.startX = touch.pageX;
        this.touch.startY = touch.pageY;
        this.touch.cd = this.$refs.middleLeft;
        this.touch.lyric = this.$refs.lyricScroll.$el;
        this.touch.cd.style[TRANSITION] = '';
        this.touch.lyric.style[TRANSITION] = '';
      },
      middleTouchMove (e) {
        if (!this.touch.initaled) {
          return;
        }
        let touch = e.touches[0];
        let deltaX = touch.pageX - this.touch.startX;
        let deltaY = touch.pageY - this.touch.startY;
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return;
        }

        // cd 左划
        if (this.currentMiddleShow === 'cd' && deltaX < 0) {
          this.touch.deltaX = deltaX;
          this.touch.cd.style[TRANSFORM] = `translate3d(${deltaX}px,0,0)`;
          this.touch.lyric.style[TRANSFORM] = `translate3d(${deltaX}px,0,0)`;
        }
        // lyric 右划
        if (this.currentMiddleShow === 'lyric' && deltaX > 0) {
          this.touch.deltaX = deltaX;
          this.touch.lyric.style[TRANSFORM] = `translate3d(${deltaX - this.touch.screenW}px,0,0)`;
          this.touch.cd.style[TRANSFORM] = `translate3d(${deltaX - this.touch.screenW}px,0,0)`;
        }
      },
      middleTouchEnd (e) {
        let deltaX = this.touch.deltaX;
        let screenW = parseInt(this.touch.screenW);
        // 在cd页面 向左滑动
        if (this.currentMiddleShow === 'cd' && deltaX < 0) {
          // 超过临界值
          this.touch.cd.style[TRANSITION] = 'all 0.5s';
          this.touch.lyric.style[TRANSITION] = 'all 0.5s';
          if (Math.abs(deltaX) > screenW / 4) {
            this.touch.cd.style[TRANSFORM] = `translate3d(${0 - screenW}px,0,0)`;
            this.touch.lyric.style[TRANSFORM] = `translate3d(${0 - screenW}px,0,0)`;
            this.currentMiddleShow = 'lyric';
          } else {
            this.touch.cd.style[TRANSFORM] = `translate3d(0,0,0)`;
            this.touch.lyric.style[TRANSFORM] = `translate3d(0,0,0)`;
          }
        }

        // 在lyric页面 向右滑动
        if (this.currentMiddleShow === 'lyric' && deltaX > 0) {
          // 超过临界值
          this.touch.cd.style[TRANSITION] = 'all 0.5s';
          this.touch.lyric.style[TRANSITION] = 'all 0.5s';
          if (Math.abs(deltaX) > screenW / 4) {
            this.touch.cd.style[TRANSFORM] = `translate3d(0,0,0)`;
            this.touch.lyric.style[TRANSFORM] = `translate3d(0,0,0)`;
            this.currentMiddleShow = 'cd';
          } else {
            this.touch.cd.style[TRANSFORM] = `translate3d(${0 - screenW}px,0,0)`;
            this.touch.lyric.style[TRANSFORM] = `translate3d(${0 - screenW}px,0,0)`;
          }
        }
      },
      showPlayList () {
        this.$refs.playList.show();
      },
      ...mapActions([
        'savePlayHistory'
      ])
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable";
  @import "~common/stylus/mixin";
  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      &.normal-active, &.normal-leave-active
        transition: all 0.4s
      .top, .bottom
        transition: all 0.4s cubic-bezier(0, 0, 0.13, 1.77)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 150px, 0)
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position: absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)

        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
                box-sizing: border-box
                border: 10px solid rgba(255, 255, 255, 0.1)
          .lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            font-size: $font-size-medium
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .txt
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 35px
        width: 100%
        .dot-wrapper
          width: 100%
          text-align: center
          vertical-align: top
          font-size: 0
          .dot
            display: inline-block
            width: 8px
            height: 8px
            margin: 0 4px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 15px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0 auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            .icon-favorite
              color: #d93f30
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            text-align: center
            padding: 0 20px
            i
              font-size: 40px
          .i-right
            text-align: left
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      width: 100%
      height: 60px
      z-index: 180
      background: $color-highlight-background
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s cubic-bezier(0, 0, 0.04, 1.38)
      &.mini-enter, &.mini-leave-to
        opacity: 0
        transform: translate3d(0, 50px, 0)

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)

</style>
