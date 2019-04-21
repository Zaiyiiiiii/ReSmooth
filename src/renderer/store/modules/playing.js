import { Salad } from "../../class/SaladAPI/Salad"
import store from 'localforage'

// let worker = new PlayingWorker()
// let audioCtx = new (window.AudioContext || window.webkitAudioContext)()
// let audioSrc = audioCtx.createMediaElementSource(playing)
// let analyser = audioCtx.createAnalyser()
// audioSrc.connect(analyser)
// audioSrc.connect(audioCtx.destination)
// analyser.fftSize = 2048
// let bufferLength = analyser.frequencyBinCount
// worker.postMessage({ action: "init", value: Audio })


let initVolume = 8
let maxVolume = 20

const state = {
    isPlaying: false,
    player: undefined,
    playmode: "random",
    currentPlaying: undefined,
    volume: initVolume,
    filter: "",
    mute: false,
    off: false,
    playlist: [],
    playingIndex: undefined,
    pause: undefined,
    mini: false,
    progress: 0,
    duration: 0.1,
    historyCount: 0
}

// getters
const getters = {
}

// actions
const actions = {
    insertSong({ commit, state, dispatch }, song) {
        commit("addSong", { song: song, front: true })
        dispatch("nextSong", true)
    },
    async nextSong({ commit, state, rootState, dispatch }, next) {
        commit("skipSong", next)
        if (state.currentPlaying) {
            let url = await rootState.salad.getSongUrl(state.currentPlaying)
            if (!url) {
                dispatch("nextSong")
                return
            }
            state.player.src = url
            document.title = state.currentPlaying.name
            commit("play")
        }
        else {
            state.player.src = undefined
        }
    },
    // 历史暂时没有和用户绑定，以何形式结合？有待商榷。
    async getHistory() {
        return await store.getItem("history")
    },
    saveToHistory({ commit }, song) {
        store.getItem("history").then((result) => {
            console.log(result)
            let history = result || []
            let date = new Date()
            history = history.concat([{ id: date.getTime(), time: date, song: song }])
            if (result) {
                store.removeItem("history")
            }
            store.setItem("history", history).then(
                () => {
                    commit("setHistoryCount", history.length)
                }
            )

        })
        // store.setItem("history")
    },
    initPlayer({ commit, state, dispatch }) {
        let player = new Audio()
        player.volume = initVolume / maxVolume
        player.onended = async () => {
            dispatch("saveToHistory", state.currentPlaying)
            dispatch("nextSong")
        }
        player.ontimeupdate = (event) => {
            commit('setProgress', event.target.currentTime)
        }
        player.ondurationchange = (event) => {
            commit('setDuration', event.target.duration)
        }
        player.onpause = (event) => {
            state.isPlaying = false
        }
        player.onplay = (event) => {
            state.isPlaying = true
        }
        const { globalShortcut } = require('electron').remote

        globalShortcut.register('MediaNextTrack', () => {
            dispatch("nextSong")
        })
        globalShortcut.register('MediaPlayPause', () => {
            state.isPlaying ?
                commit("pause") :
                commit("play")
        })

        commit("setPlayer", player)
    }
}


// mutations
const mutations = {
    setFilter(state, filter) {
        state.filter = filter
    },
    setHistoryCount(state, count) {
        state.historyCount = count
    },
    setPlayer(state, player) {
        state.player = player
    },
    setDuration(state, duration) {
        state.duration = duration
    },
    setProgress(state, progress) {
        state.progress = progress
    },
    skipSong(state, next) {
        if (state.playmode == 'order' || next) {
            state.currentPlaying = state.playlist.shift() || undefined
            return
        }
        if (state.playmode == "repeat") {
            return
        }
        if (state.playmode == 'random') {
            let count = Math.floor(Math.random() * state.playlist.length)
            state.currentPlaying = state.playlist.splice(count, 1)[0] || undefined
            return
        }
    },
    addSong(state, { song, front }) {
        if (song instanceof Array) {
            state.playlist = state.playlist.concat(song)
            return
        }
        state.playlist[front ? "unshift" : "push"](song)
    },
    minify(state) {
        let remote = require("electron").remote.getCurrentWindow()
        let position = remote.getBounds()
        // remote.setSize(state.mini ? 360 : 50, state.mini ? 500 : 360)
        if (state.mini) {
            document.body.style.transition = "all 0.3s"
            document.body.style.opacity = 0
            remote.setSkipTaskbar(false)
            setTimeout(() => {
                remote.setBounds({ x: position.x - 310, y: position.y, width: 360, height: 500 })
                remote.setAlwaysOnTop(!state.mini)
                setTimeout(() => {
                    document.body.style.width = 360 + "px"
                    document.body.style.height = 500 + "px"
                    document.body.style.opacity = 1
                    state.mini = !state.mini
                }, 300)
            }, 250)

        }
        else {
            document.body.style.transition = "all 0.3s"
            document.body.style.opacity = 0
            document.body.style.width = (state.mini ? 360 : 50) + "px"
            document.body.style.height = (state.mini ? 500 : 360) + "px"
            remote.setSkipTaskbar(true)
            remote.setAlwaysOnTop(!state.mini)
            setTimeout(() => {
                remote.setBounds({ x: state.mini ? position.x - 310 : position.x + 310, y: position.y, width: state.mini ? 360 : 50, height: state.mini ? 500 : 360 })
                document.body.style.opacity = 1
                state.mini = !state.mini
            }, 300)
        }
    },
    setPlayingInfo(state, info) {
        state.playingInfo = info
    },
    // addSong(state, song, info) {
    //     state.isPlaying = true
    //     if (!song.url) {
    //         //应弹出全局提示
    //         nextSong()
    //     }
    //     // if (state.playing) {
    //     //     state.playing.unload()
    //     // }
    //     // state.playing = new Howl({ src: [song.url], loop: true, usingWebAudio: true, volume: state.volume / 20, mute: state.mute })
    //     state.playing.src = song.url
    //     state.playing.play()
    //     state.pause = false
    //     console.log(state)
    //     state.playing.onended = nextSong
    //     mutations.setPlayingInfo(state, info)
    //     if (info.album && info.album.coverlink) {
    //         Vibrant.from(info.album.coverlink).getPalette().then((res) => {
    //             state.playingTheme = res
    //         })
    //     }
    // },
    setVolume(state, volume) {
        if (volume > 20) {
            return
        }
        if (volume < 0) {
            if (state.mute) {
                state.mute = false
                state.player.muted = state.mute
            }
            state.off = true
            return
        }
        state.volume = volume
        state.player.volume = state.volume / 20
        if (state.mute) {
            state.mute = false
            state.player.muted = state.mute
        }
        if (state.off) {
            state.off = false
        }
        return
    },
    setMute(state, mute) {
        state.mute = mute
        state.player.muted = state.mute
        return
    },
    seek(state, sec) {
        if (state.player) {
            state.player.currentTime = sec
        }
    },
    pause(state) {
        if (state.player) {
            state.player.pause()
            state.pause = true
        }
    },
    play(state) {
        if (state.player) {
            state.player.play()
            state.pause = false
        }
    },
    setMode(state, mode) {
        state.playmode = mode
    },
    clearPlaylist(state) {
        state.playlist = []
    },
    deletePlaylist(state, index) {
        state.playlist.splice(index, 1)
    }
}



export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}