<template>
  <div class="song-list">
    <ul>
      <li @click="selectSong(song,index)" class="item" v-for="(song,index) in songs" :key="song.id">
        <div class="content">
          <h2 class="name">{{ song.name }}</h2>
          <div class="desc">{{ getDesc(song) }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      songs: {
        type: Array,
        default: null
      }
    },
    methods: {
      getDesc (song) {
        return `${song.name} · ${song.album}`;
      },
      selectSong (song, index) {
        this.$emit('select_song', song, index);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable";
  @import "~common/stylus/mixin";

  .item
    display: flex
    align-items: center
    height: 64px
    box-sizing: border-box
    font-size: $font-size-medium
    .content
      flex: 1
      line-height: 20px
      overflow: hidden
      .name
        no-wrap()
        color: $color-text
      .desc
        no-wrap()
        margin-top: 4px
        color: $color-text-d

</style>
