<template>
  <scroll class="suggest"
          ref="suggestScroll"
          :data="suggestList"
          :pullup="pullup"
          :beforeScroll="beforeScroll"
          @beforeScroll="listScroll"
          @scrollToEnd="searchMore">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item,index) in suggestList" :key="index">
        <div class="icon">
          <i :class="getIcon(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getSuggestDesc(item)"></p>
        </div>
      </li>
      <loading v-if="isHasMore" title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!isHasMore&&!suggestList.length">
      <no-result></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import { getSuggestList } from 'api/search';
  import { ERR_OK } from '../../api/config';
  import { createSong } from 'common/js/song';
  import Scroll from 'base/scroll/scroll';
  import Loading from 'base/loading/loading';
  import { mapMutations, mapActions } from 'vuex';
  import Singer from 'common/js/singer';
  import NoResult from 'components/no-result/no-result';

  const TYPE_SINGER = 'type_singer';
  const PER_PAGE = 20;

  export default {
    components: {
      Scroll, Loading, NoResult
    },
    props: {
      queryString: {
        type: String,
        default: ''
      }
    },
    created () {
      this.showSinger = 1;
      this.pullup = true;
      this.beforeScroll = true;
    },
    data () {
      return {
        currentPage: 1,
        suggestList: [],
        isHasMore: true
      };
    },
    watch: {
      queryString (query) {
        // 请求服务器
        if (query) {
          this.search(query);
        }
      }
    },
    methods: {
      selectItem (item) {
        // 歌手
        if (item.type === TYPE_SINGER) {
          let {singermid, singername} = item;
          let singer = new Singer({
            id: singermid,
            name: singername
          });
          this.$router.push({
            path: `search/${singer.id}`
          });
          // vuex传递数据
          console.log(singer);
          this.setSinger(singer);
        } else {
          // 歌曲
          this.insertSong(item);
        }
        // 派发事件
        this.$emit('suggestItemClick');
      },
      searchMore () {
        // 加载更多数据
        if (this.isHasMore) {
          getSuggestList(this.queryString, this.currentPage, 0, PER_PAGE).then(res => {
            if (res.code === ERR_OK) {
              this.suggestList = this.suggestList.concat(this.normalizeSuggestList(res.data));
              this._checkHasMore(res.data);
            }
          }).catch(e => {
            this.isHasMore = false;
          });
        }
      },
      getSuggestDesc (item) {
        if (item.type === TYPE_SINGER) {
          return item.singername;
        } else {
          return `${item.name}-${item.singer}`;
        }
      },
      getIcon (item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine';
        } else {
          return 'icon-music';
        }
      },
      search (query) {
        this.currentPage = 1;
        getSuggestList(query, this.currentPage, this.showSinger, PER_PAGE).then(res => {
          if (res.code === ERR_OK) {
            this.suggestList = this.normalizeSuggestList(res.data);
            this._checkHasMore(res.data);
          }
        }).catch(e => {
          console.log(e);
          this.isHasMore = false;
        });
      },
      _checkHasMore (data) {
        if (!data.song.list || this.currentPage * PER_PAGE >= data.song.totalnum) {
          this.isHasMore = false;
        } else {
          this.isHasMore = true;
        }
        this.currentPage++;
      },
      normalizeSuggestList (data) {
        let ret = [];
        // 歌手
        if (data.zhida && data.zhida.singermid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}});
        }
        // 歌曲
        if (data.song && data.song.list) {
          let musicData = data.song.list;
          musicData.forEach(item => {
            ret.push(createSong(item));
          });
        }
        return ret;
      },
      refresh () {
        this.$refs.suggestScroll.refresh();
      },
      listScroll () {
        this.$emit('listScroll');
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
        .icon
          flex: 0 0 30px
          width: 30px
          font-size: 14px
          color: $color-text-d
        .name
          flex: 1
          font-size: $font-size-medium
          color: $color-text-d
          overflow: hidden
          .text
            no-wrap()
</style>
