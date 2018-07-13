<template>
  <scroll :data="data" class="listview" ref="listView">
    <ul>
      <li class="list-group" v-for="group in data" :key="group.title">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li @click="selectItem(item)" class="list-group-item" v-for="item in group.items" :key="item.id">
            <img v-lazy="item.avatar" alt="" class="avatar">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="loading-container" v-if="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';
  import Loading from 'base/loading/loading';

  export default {
    name: 'listview',
    props: {
      data: {
        type: Array,
        default: null
      }
    },
    components: {
      Scroll, Loading
    },
    methods: {
      refresh () {
        this.$refs.listView.refresh();
      },
      selectItem (item) {
        this.$emit('select', item);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable";

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .loading-container
      display: flex
      justify-content: center
      align-items: center
      position: absolute
      top: 0
      bottom: 0
      width: 100%
</style>
