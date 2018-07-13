<template>
  <div class="m-header">
    <div class="full-screen" @click="fullScreenClick"
         v-text="screenState?'退出全屏':'全屏显示'">
    </div>
    <div class="icon"></div>
    <div class="text">小鸡 音乐</div>
    <router-link tag="div" to="/user" class="mine">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapMutations } from 'vuex';
  import { requestFullScreen, exitFullScreen } from 'common/js/util';

  export default {
    computed: {
      ...mapGetters([
        'screenState'
      ])
    },
    methods: {
      fullScreenClick () {
        if (this.screenState) {
          exitFullScreen();
          this.setScreenState(false);
        } else {
          requestFullScreen();
          this.setScreenState(true);
        }
      },
      ...mapMutations({
        setScreenState: 'SET_SCREEN_STATE'
      })
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .m-header
    position: relative
    height: 44px
    text-align: center
    color: $color-theme
    font-size: 0
    .full-screen
      display: inline-block
      position: absolute
      left: 10px
      line-height: 44px
      color: $color-text-ll
      font-size: $font-size-medium
    .icon
      display: inline-block
      width: 30px
      height: 32px
      bg-image('logo')
      margin-top: 6px
      margin-right: 9px
      vertical-align: top
      background-size: 30px 32px
    .text
      display: inline-block
      line-height: 44px
      font-size: $font-size-large
    .mine
      position: absolute
      top: 0
      right: 0
      .icon-mine
        display: block
        padding: 12px
        font-size: 20px
        color: $color-theme
</style>
