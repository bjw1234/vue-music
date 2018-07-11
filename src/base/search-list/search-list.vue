<template>
  <div class="search-list" v-show="searchList">
    <transition-group name="list" tag="ul">
      <li @click="selectItem(item)" class="search-item" v-for="item in searchList" :key="item">
        <span class="text">{{ item }}</span>
        <span class="icon" @click.stop="deleteItem(item)">
           <i class="icon-delete"></i>
         </span>
      </li>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      searchList: {
        type: Array,
        default: null
      }
    },
    methods: {
      selectItem (item) {
        this.$emit('selectItem', item);
      },
      deleteItem (item) {
        this.$emit('deleteItem', item);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.2s
      &.list-enter, &.list-leave-to
        opacity: 0
        transform: translateX(100%)
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>
