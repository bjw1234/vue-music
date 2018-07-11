<template>
  <div class="no-result">
    <div class="icon-wrapper">
      <img src="" alt="" class="icon">
    </div>
    <p class="title">{{title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '抱歉，暂无搜素结果'
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable";
  .no-result
    text-align: center
    .title
      color: $color-text-d
</style>
