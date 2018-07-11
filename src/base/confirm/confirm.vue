<template>
  <transition name="fade">
    <div class="mask-wrapper" v-show="isShow" @click.stop>
      <div class="confirm">
        <div class="title">{{ title }}</div>
        <div class="btns">
          <div @click="negativeClick" class="btn left">{{ negativeBtn }}</div>
          <div @click="positiveClick" class="btn">{{ positiveBtn }}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '确定清空搜索历史吗？'
      },
      negativeBtn: {
        type: String,
        default: '取消'
      },
      positiveBtn: {
        type: String,
        default: '清空'
      }
    },
    data () {
      return {
        isShow: false
      };
    },
    methods: {
      show () {
        this.isShow = true;
      },
      hide () {
        this.isShow = false;
      },
      negativeClick () {
        this.$emit('confirmNegative');
        this.hide();
      },
      positiveClick () {
        this.$emit('confirmPositive');
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .mask-wrapper
    display: flex
    align-items: center
    justify-content: center
    position: fixed
    z-index: 998
    left: 0
    right: 0
    top: 0
    bottom: 0
    background: $color-dialog-background
    &.fade-enter-active
      transition: all 0.5s
      .confirm
        animation: scale-animation 0.5s
    &.fade-leave-active
      transition: all 0.5s
      .confirm
        animation: scale-animation 0.4s
        animation-direction: reverse
    &.fade-enter, &.fade-leave-to
      opacity: 0
    .confirm
      width: 270px
      border-radius: 13px
      transform-origin: center center
      background: $color-highlight-background
      z-index: 999
      .title
        padding: 19px 15px
        line-height: 22px
        text-align: center
        font-size: $font-size-large
        color: $color-text-l
      .btns
        display: flex
        align-items: center
        text-align: center
        font-size: $font-size-large
        .btn
          flex: 1
          line-height: 22px
          padding: 10px 0
          border-top: 1px solid $color-background-d
          color: $color-text-d
          &.left
            border-right: 1px solid $color-background-d

  @keyframes scale-animation
    0%
      transform: scale(0)
    50%
      transform: scale(1.1)
    100%
      transform: scale(1.0)
</style>
