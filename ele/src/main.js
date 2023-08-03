// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import 'vue2-animate/dist/vue2-animate.min.css'
import Vuex from 'vuex'

Vue.use(Vuex);

Vue.config.productionTip = false
Vue.prototype.axios = axios.create({
  baseURL: 'http://localhost:8090/api/',
  timeout: 1000,
  /*headers: {
    'x-aaa': 12
  }*/
})

const store=new Vuex.Store({
  strict: true,       //强制全用mutation完成修改——如果在mutation之外修改报错
  state: {
    token: null,
    cur_user: null
  },
  /*modules: {
    user: require('./stores/user.store'),
    company: {
      count: 0
    }
  },*/
  mutations: {
    updateToken(state, arg){
      if(!arg || arg.length!=32){
        console.error(`token格式不对`, arg);
      }else{
        state.token=arg;
      }
    },
    updateUser(state, arg){
      state.cur_user=arg;
    }
  },
  actions: {
    updateToken({commit, state}, arg){
      commit('updateToken', arg);
    },
    updateUser({commit}, arg){
      commit('updateUser', arg);
    }
  },
  getters: {
  }
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
