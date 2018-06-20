import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// 状态
const state = {
  singer: {}
};

// 跟踪状态的变化
const mutations = {
  setSinger (state, singer) {
    state.singer = singer;
  }
};

// 实例化store对象
export default new Vuex.Store({
  state,
  mutations
});
