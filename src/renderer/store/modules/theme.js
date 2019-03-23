import store from 'localforage'
const state = {
    mainColor: undefined,
    subColor: undefined,
    coverPattern: true
}

// getters
const getters = {

}

// actions
const actions = {
    checkout: {
        root: true,
        handler: ({ commit, state }, products) => {
            // console.log("ojjj")
        }
    },
    // 将主题还原未默认主题
    setThemeAsDefault: {
        root: true,
        handler: async ({ state, commit }) => {
            //从数据库获取默认主题，如没有，写入数据库，此方法应在运行APP时调用一次。
            let theme = await store.getItem("theme")
            if (!theme) {
                theme = {
                    mainColor: "rgba(120,120,120,1)",
                    subColor: "rgba(233,233,233,1)"
                }
                await store.setItem("theme", theme)
            }

            mutations.setTheme(state, theme)
            return theme
        }
    },
    writeDefaultTheme() {

    }
}

// mutations
const mutations = {
    setTheme(state, theme) {
        state = Object.assign(state, theme)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}