import Vue from 'vue'
import Vuex from 'vuex'
// import theme from './modules/theme'
import playing from './modules/playing'
// import search from './modules/search'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    salad: undefined
  },
  modules: {
    // theme,
    playing,
    // search
  }
})