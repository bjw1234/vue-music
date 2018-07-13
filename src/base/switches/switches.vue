<template>
  <ul class="switches" v-show="switches">
    <li class="switch-item"
        @click="switchItemClick(index)"
        :class="{'active':index===switchIndex}"
        v-for="(item,index) in switches" :key="index">
      {{ item.name }}
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      switches: {
        type: Array,
        default: null
      },
      switchIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      switchItemClick (index) {
        this.$emit('switchSelect', index);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .switches
    display: flex
    align-items: center
    width: 240px
    margin: 0 auto
    border: 1px solid $color-highlight-background
    border-radius: 5px
    .switch-item
      flex: 1
      padding: 8px
      text-align: center
      font-size: $font-size-medium
      color: $color-text-d
      &.active
        background: $color-highlight-background
        color: $color-text
</style>
