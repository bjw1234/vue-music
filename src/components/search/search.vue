<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @queryChange="onQueryChange"></search-box>
    </div>
    <scroll ref="shortCut" v-show="!query" class="shortcut-wrapper">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li @click="selectHotKey(item)" class="item" v-for="item in hotKeyList" :key="item.n">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory&&searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span @click="showConfirm" class="clear">
                <i class="icon-clear"></i>
              </span>
          </h1>
          <search-list :searchList="searchHistory"
                       @deleteItem="historyItemDelete"
                       @selectItem="historyItemSelect">
          </search-list>
        </div>
      </div>
    </scroll>
    <div v-show="query" class="search-result" ref="searchResult">
      <suggest @suggestItemClick="saveQuery"
               @listScroll="suggestScroll"
               :queryString="query" ref="suggest">
      </suggest>
    </div>
    <router-view></router-view>
    <confirm ref="confirm"
             @confirmPositive="onConfirmPositive">
    </confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box';
  import Suggest from 'components/suggest/suggest';
  import { getHotKey } from 'api/search';
  import { ERR_OK } from 'api/config';
  import { playListMixin, historyMixin } from 'common/js/mixin';
  import SearchList from 'base/search-list/search-list';
  import Scroll from 'base/scroll/scroll';
  import Confirm from 'base/confirm/confirm';

  export default {
    mixins: [playListMixin, historyMixin],
    components: {
      SearchBox, Suggest, SearchList, Scroll, Confirm
    },
    data () {
      return {
        hotKeyList: []
      };
    },
    watch: {
      query (val) {
        if (!val) {
          setTimeout(() => {
            this.$refs.shortCut.refresh();
          }, 20);
        }
      }
    },
    created () {
      this._getHotKey();
    },
    methods: {
      _getHotKey () {
        getHotKey().then(res => {
          if (res.code === ERR_OK) {
            this.hotKeyList = res.data.hotkey.slice(0, 10);
          }
        });
      },
      selectHotKey (item) {
        this.$refs.searchBox.setQuery(item.k);
      },
      handlePlayList (list) {
        let bottom = list.length ? '60px' : 0;
        this.$refs.searchResult.style.bottom = bottom;
        this.$refs.shortCut.$el.style.bottom = bottom;
        this.$refs.suggest.refresh();
        this.$refs.shortCut.refresh();
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      overflow: hidden
      .shortcut
        .hot-key
          margin: 0 20px 20px
          .title
            margin-bottom: 20px
            color: $color-text-l
            font-size: $font-size-medium
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            color: $color-text-d
            font-size: $font-size-medium
            background: $color-highlight-background

        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            height: 40px
            align-items: center
            font-size: $font-size-medium
            .text
              flex: 1
              color: $color-text-l
            .clear
              extend-click()
              color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
