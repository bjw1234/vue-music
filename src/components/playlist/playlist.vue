<template>
  <transition name="list">
    <div class="playlist" @click="hide" v-show="showFlag">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click.stop="changeMode"></i>
            <span class="text" v-text="textMode"></span>
            <span class="clear" @click.stop="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll :data="sequenceList" ref="listScroll" class="list-content">
          <transition-group name="out" tag="ul">
            <li ref="itemHook" class="item"
                :data-id="item.id"
                v-for="(item,index) in sequenceList"
                :key="item.id" @click="itemClick(item,index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text" v-html="item.name" :class="getCurrentTxt(item)"></span>
              <span class="like" @click.stop="toggleLike(item)">
                <i :class="iconFavorite(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
              <i class="icon-delete"></i>
            </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click.stop="showAddSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm title="是否清空当前播放列表？"
               ref="confirm" @confirmPositive="confirmClear">
      </confirm>
      <add-song ref="addSongHook"></add-song>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';
  import { playMode } from 'common/js/config';
  import { mapActions } from 'vuex';
  import Confirm from 'base/confirm/confirm';
  import { playerMixin } from 'common/js/mixin';
  import AddSong from 'components/add-song/add-song';

  export default {
    mixins: [playerMixin],
    components: {
      Scroll, Confirm, AddSong
    },
    data () {
      return {
        showFlag: false
      };
    },
    computed: {
      textMode () {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环';
      }
    },
    methods: {
      showAddSong () {
        this.$refs.addSongHook.show();
      },
      showConfirm () {
        this.$refs.confirm.show();
      },
      confirmClear () {
        this.deleteSongAll();
        this.hide();
        this.$refs.confirm.hide();
      },
      deleteOne (item) {
        this.deleteSong(item);
        if (!this.playList.length) {
          this.hide();
        }
      },
      itemClick (item, index) {
        if (this.mode === playMode.random) {
          index = this.playList.findIndex((song) => {
            return item.id === song.id;
          });
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.setPlayingState(true);
        }
      },
      getCurrentIcon (item) {
        if (item.id === this.currentSong.id) {
          return 'icon-play';
        } else {
          return '';
        }
      },
      getCurrentTxt (item) {
        if (item.id === this.currentSong.id) {
          return 'txt-cur';
        } else {
          return '';
        }
      },
      show () {
        this.showFlag = true;
        this.refresh();
        this.scrollToCurrentSong();
      },
      refresh () {
        setTimeout(() => {
          this.$refs.listScroll.refresh();
        }, 20);
      },
      hide () {
        this.showFlag = false;
      },
      scrollToCurrentSong () {
        setTimeout(() => {
          let items = this.$refs.itemHook;
          if (!items && !items.length) {
            return;
          }
          let ele = items.find(item => {
            return parseInt(item.dataset.id) === parseInt(this.currentSong.id);
          });
          this.$refs.listScroll.scrollToElement(ele, 300);
        }, 320);
      },
      ...mapActions([
        'deleteSong',
        'deleteSongAll'
      ])
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    opacity: 1
    background-color: $color-background-d
    &.list-enter-active, &.list-leave-active
      transition: all 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-enter, &.list-leave-to
      opacity: 0
      .list-wrapper
        opacity: 0
        transform: translateY(100%)
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      opacity: 1
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 25px
            color: $color-theme-d
          .text
            flex: 1
            color: $color-text-l
            font-size: $font-size-medium
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d

      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          height: 40px
          opacity: 1
          align-items: center
          padding: 0 30px 0 20px
          &.out-enter-active, &.out-leave-active
            transition: all 0.3s
          &.out-enter, &.out-leave-to
            opacity: 0
            transform: translateX(100%)
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            &.txt-cur
              color: $color-theme
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            color: $color-theme
            font-size: $font-size-small
      .list-operate
        width: 140px
        margin: 20px auto 30px
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>
