<template>
  <div class="recommend" ref="recommend">
    <scroll :data="descList" class="scroll" ref="scroll">
      <div>
        <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
          <slider>
            <div v-for="item in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" @load="_loadImage" alt="">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" class="item" v-for="item in descList" :key="item.id">
              <div class="icon">
                <img width="60px" height="60px" v-lazy="item.imgurl" alt="">
              </div>
              <div class="text">
                <div class="name" v-html="item.creator.name"></div>
                <div class="desc" v-html="item.dissname"></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!descList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getRecommend, getDescList } from 'api/recommend';
  import { ERR_OK } from 'api/config';
  import Slider from 'base/slider/slider';
  import Scroll from 'base/scroll/scroll';
  import Loading from 'base/loading/loading';
  import { playListMixin } from 'common/js/mixin';
  import { mapMutations } from 'vuex';

  export default {
    mixins: [playListMixin],
    created () {
      this._getRecommend();
      this._getDescList();
    },
    components: {
      Slider, Scroll, Loading
    },
    data () {
      return {
        recommends: [],
        descList: []
      };
    },
    methods: {
      // 解决播放器遮挡列表的问题
      handlePlayList (list) {
        let bottom = list.length > 0 ? '60px' : 0;
        this.$refs.recommend.style.bottom = bottom;
        this.$refs.scroll.refresh();
      },
      _getRecommend () {
        getRecommend().then(res => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider;
          }
        });
      },
      _getDescList () {
        getDescList().then(res => {
          if (res.data.code === ERR_OK) {
            let data = res.data.data;
            this.descList = data.list;
          }
        });
      },
      _loadImage () {
        if (!this._loadImageFlag) {
          this.$refs.scroll.refresh();
          this._loadImageFlag = true;
        }
      },
      selectItem (item) {
        this.$router.push({
          path: `recommend/${item.dissid}`
        });
        // 通过vuex将item传递出去
        this.setRecommendDesc(item);
      },
      ...mapMutations({
        setRecommendDesc: 'SET_RECOMMEND_DESC'
      })
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .scroll
      height: 100%
      overflow: hidden
      .recommend-list
        .list-title
          text-align: center
          line-height: 65px
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              no-wrap()
              margin-bottom: 10px
              color: $color-text
            .desc
              no-wrap()
              color: $color-text-d
      .loading-container
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
</style>
