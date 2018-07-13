<template>
  <transition name="move">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">
          添加歌曲到列表
        </h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @queryChange="onQueryChange"></search-box>
      </div>
      <div class="shortcut">
        <switches :switches="switches"
                  :switchIndex="switchIndex"
                  @switchSelect="switchSelect">
        </switches>
        <div class="list-wrapper">
          <scroll ref="playHisHook" class="list-scroll" :data="playHistory" v-if="switchIndex===0">
            <div class="list-inner">
              <song-list :songs="playHistory" @select_song="selectSong"></song-list>
            </div>
          </scroll>
          <scroll ref="searchHisHook" class="list-scroll" :data="searchHistory" v-if="switchIndex===1">
            <div class="list-inner">
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
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :showSinger="0" :queryString="query"
                 @suggestItemClick="saveQuery"
                 @listScroll="suggestScroll">
        </suggest>
      </div>
      <confirm ref="confirm"
               @confirmPositive="onConfirmPositive">
      </confirm>
      <top-tip ref="tip" class="tip-title">
        <i class="icon-ok"></i>
        <span class="text">一首歌曲加入到了播放队列</span>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapActions } from 'vuex';
  import Scroll from 'base/scroll/scroll';
  import SearchBox from 'base/search-box/search-box';
  import Switches from 'base/switches/switches';
  import Confirm from 'base/confirm/confirm';
  import SearchList from 'base/search-list/search-list';
  import Suggest from 'components/suggest/suggest';
  import TopTip from 'base/top-tip/top-tip';
  import { historyMixin } from 'common/js/mixin';
  import SongList from 'base/song-list/song-list';
  import { Song } from 'common/js/song';

  export default {
    mixins: [historyMixin],
    components: {
      SearchBox, Switches, Suggest, Scroll, SongList, SearchList, Confirm, TopTip
    },
    computed: {
      ...mapGetters([
        'playHistory'
      ])
    },
    watch: {
      showFlag (flag) {
        if (flag) {
          this.refresh();
        }
      },
      switchIndex () {
        this.refresh();
      }
    },
    data () {
      return {
        showFlag: false,
        switches: [
          {name: '播放记录'},
          {name: '搜索历史'}
        ],
        switchIndex: 0
      };
    },
    methods: {
      refresh () {
        setTimeout(() => {
          let play = this.$refs.playHisHook;
          let search = this.$refs.searchHisHook;
          play && play.refresh();
          search && search.refresh();
        }, 50);
      },
      showTip () {
        this.$refs.tip.show();
      },
      selectSong (song, index) {
        if (index === 0) {
          return;
        }
        this.showTip();
        this.insertSong(new Song(song));
      },
      switchSelect (index) {
        this.switchIndex = index;
      },
      show () {
        this.showFlag = true;
      },
      hide () {
        this.showFlag = false;
      },
      saveQuery () {
        this.showTip();
        this.insertHistory(this.query);
      },
      ...mapActions([
        'insertSong',
        'insertHistory'
      ])
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.move-enter-active, &.move-leave-active
      transition: all 0.4s
    &.move-enter, &.move-leave-to
      transform: translateX(100%)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme
    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        background: $color-background
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
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
      top: 124px
      bottom: 0
      width: 100%
      background: $color-background
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
