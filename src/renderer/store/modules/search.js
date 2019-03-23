import store from 'localforage'
const state = {
    search: undefined
}

// getters
const getters = {

}

// actions
const actions = {

}

// mutations
const mutations = {
    setSearchValue(state, value) {
        state.search = value
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}