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
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdRotate">
                <img :src="currentSong.image" alt="" class="image">
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="dot-wrapper"></div>
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
              <i class="icon-not-favorite"></i>
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
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio" :src="currentSongUrl"
           @canplay="songCanPlay"
           @error="songError"
           @ended="songEnd"
           @timeupdate="updateTime">
      <p>sorry,your browser not support audio element</p>
    </audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import { ERR_OK } from 'api/config';
  import Velocity from 'velocity-animate';
  import { disorder } from 'common/js/util';
  import { playMode } from 'common/js/config';
  import { getSongVkey, getSongURL } from 'api/singer';
  import { mapGetters, mapMutations } from 'vuex';
  import progressBar from 'base/progress-bar/progress-bar';
  import progressCircle from 'base/progress-circle/progress-circle';
  //  import { prefixStyle } from 'common/js/dom';
  //  const TRANSFORM = prefixStyle('transform');

  export default {
    components: {
      progressBar, progressCircle
    },
    data () {
      return {
        circleRadius: 32,
        currentSongUrl: '',
        currentSongReady: false,
        currentSongTime: 0
      };
    },
    computed: {
      iconMode () {
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
      },
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
        'fullScreen',
        'playList',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'
      ])
    },
    watch: {
      currentSong (newSong, oldSong) { // 歌曲变化请求不同的url
        if (newSong.id === oldSong.id) {
          return;
        }
        let mid = this.currentSong.mid;
        if (mid) {
          getSongVkey(mid).then((res) => {
            if (res.code === ERR_OK) {
              if (res.data.items.length > 0) {
                let vkey = res.data.items[0].vkey;
                this.currentSongUrl = getSongURL(mid, vkey);
                console.log(this.currentSongUrl);
              }
            }
          });
        }
      },
      currentSongUrl () {
        this.$nextTick(() => {
          this.$refs.audio.play();
        });
      },
      playing (newState) {
        let audio = this.$refs.audio;
        this.$nextTick(() => {
          newState ? audio.play() : audio.pause();
        });
      }
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
      },
      prevSong () {
        this.currentSongTime = 0;
        if (!this.currentSongReady) {
          return;
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
        this.currentSongTime = 0;
        if (!this.currentSongReady) {
          return;
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
      },
      songError () {
        this.currentSongReady = true;
      },
      songEnd () {
        if (this.mode === playMode.loop) {
          let audio = this.$refs.audio;
          audio.currentTime = 0;
          audio.play();
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
        if (!this.playing) {
          this.togglePlaying();
        }
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
        setPlayList: 'SET_PLAYLIST'
      })
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
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
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
