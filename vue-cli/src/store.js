import Vue from 'vue'
import Vuex from 'vuex'
import config from '@/config.js'
import axios from 'axios'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    navbarTitle: 'Vuex test title',
    phones: [],
    nameGroup: 'Sky workers'
  },
  getters: {
    titleLength: state => state.navbarTitle.length,
    activePhones: state => state.phones.filter(item => item.isActive)
  },
  mutations: {
    // тут стрелки можно, поскольку дыс-а нет
    changeTitle: (state, payload) => (state.navbarTitle = payload),
    setPhones: (state, payload) => (state.phones = payload),
    setNameGroup: (state, payload) => (state.nameGroup = payload)
  },
  actions: {
    // диспатч нужен, когда надо что-то добыть и только потом вызвать мутацию
    async loadPhones({ commit }) {
      try {
        commit('setPhones', (await axios.get(config.serverApi + '/users')).data)
      } catch (err) {
        alert(err.message)
      }
    }
  }
})

export default store
