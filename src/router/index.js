import Vue from 'vue';
import Router from 'vue-router';
// import Recommend from '@/components/recommend/recommend';
const Recommend = () => ({
  component: import('@/components/recommend/recommend')
});

// import Singer from '@/components/singer/singer';
const Singer = () => ({
  component: import('@/components/singer/singer')
});

// import Rank from '@/components/rank/rank';
const Rank = () => ({
  component: import('@/components/rank/rank')
});

// import Search from '@/components/search/search';
const Search = () => ({
  component: import('@/components/search/search')
});
// 用户中心
// import UserCenter from '@/components/user-center/user-center';
const UserCenter = () => ({
  component: import('@/components/user-center/user-center')
});
// 子路由
// import SingerDetail from '@/components/singer-detail/singer-detail';
const SingerDetail = () => ({
  component: import('@/components/singer-detail/singer-detail')
});

// import RecommendDesc from '@/components/recommend-desc/recommend-desc';
const RecommendDesc = () => ({
  component: import('@/components/recommend-desc/recommend-desc')
});
// import RankDetail from '@/components/rank-detail/rank-detail';
const RankDetail = () => ({
  component: import('@/components/rank-detail/rank-detail')
});

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    }, {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: RecommendDesc
        }
      ]
    }, {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    }, {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: RankDetail
        }
      ]
    }, {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
});
