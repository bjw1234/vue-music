<template>
  <div class="singer" ref="singer">
    <list-view :data="singerArr" @select="selectSinger" ref="listView"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getSinger } from 'api/singer';
  import { ERR_OK } from 'api/config';
  import pinyinUtil from 'common/js/pinyinjs/pinyinUtil';
  import SingerClz from 'common/js/singer';
  import ListView from 'base/listview/listview';
  import { mapMutations } from 'vuex';
  import { playListMixin } from 'common/js/mixin';

  const HOT_NAME = '热门';
  const HOT_SINGER_LEN = 10;

  export default {
    mixins: [playListMixin],
    components: {
      ListView
    },
    created () {
      this._getSinger();
    },
    data () {
      return {
        singerArr: []
      };
    },
    methods: {
      // 解决播放器遮挡列表的问题
      handlePlayList (list) {
        let bottom = list.length > 0 ? '60px' : 0;
        this.$refs.singer.style.bottom = bottom;
        this.$refs.listView.refresh();
      },
      _getSinger () {
        getSinger().then(res => {
          if (res.code === ERR_OK) {
            let singerList = res.singerList.data.singerlist;
            this.singerArr = this._normalizeSinger(singerList);
          }
        });
      },
      _normalizeSinger (list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        };
        list.forEach((item, index) => {
          // 热门歌手
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new SingerClz({
              id: item.singer_mid,
              name: item.singer_name
            }));
          }
          // 根据歌手名字首字母
          let name = item.singer_name;
          let char = pinyinUtil.getFirstLetter(name).charAt(0);
          if (!map[char]) {
            map[char] = {
              title: char,
              items: []
            };
          }
          map[char].items.push(new SingerClz({
            id: item.singer_mid,
            name: item.singer_name
          }));
        });

        // 为了得到有序列表进行排序
        let hot = [];
        let rec = [];
        for (let key in map) {
          let val = map[key];
          if (val.title === HOT_NAME) {
            hot.push(val);
          } else if (val.title.match(/[a-zA-Z]/)) {
            rec.push(val);
          }
        }
        // 排序
        rec.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        });
        let singerArr = hot.concat(rec);
        return singerArr;
      },
      selectSinger (singer) {
        this.$router.push({
          path: `singer/${singer.id}`
        });
        this.setSinger(singer);
//        this.$store.commit('setSinger', singer);
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
