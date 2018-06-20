<template>
  <div class="m-header">
    <div class="icon"></div>
    <div class="text">小鸡 音乐</div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {};
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
</style>
