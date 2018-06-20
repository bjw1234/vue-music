<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
  import MHeader from 'components/m-header/m-header';
  import Player from 'components/player/player';
  import Tab from 'components/tab/tab';

  export default {
    name: 'App',
    components: {
      MHeader, Tab, Player
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  #app
    color: $color-text
    font-family: 'Avenir', Helvetica, Arial, sans-serif
</style>
