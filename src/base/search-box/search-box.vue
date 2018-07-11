<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" type="text" class="box" v-model="query" :placeholder="placeholder">
    <i @click="clearQuery" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  import { debounce } from 'common/js/util';

  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌手、歌曲'
      }
    },
    data () {
      return {
        query: ''
      };
    },
    created () {
      this.$watch('query', debounce(() => {
        this.$emit('queryChange', this.query);
      }, 500));
    },
    methods: {
      clearQuery () {
        this.query = '';
      },
      setQuery (query) {
        this.query = query;
      },
      blur () {
        this.$refs.query.blur();
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .search-box
    display: flex
    width: 100%
    height: 40px
    padding: 0 6px
    align-items: center
    box-sizing: border-box
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      height: 18px
      margin: 0 5px
      line-height: 18px
      color: $color-text
      border: none
      outline: none
      font-size: $font-size-medium
      background: $color-highlight-background
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
