<template>
    <div class="player">
        <div class="player-bar">
            <div
                class="player-minify"
                @click="$store.commit('playing/minify')"
                v-if="!$store.state.playing.off"
            ></div>
            <volume></volume>
            <div style="flex:auto"></div>
            <transition
                name="playing"
                mode="out-in"
            >
                <div
                    class="player-playing"
                    v-if="$store.state.playing.currentPlaying&&!$store.state.playing.off"
                >
                    <div
                        class="player-playing-background"
                        :style="{backgroundImage:`url(${$store.state.playing.currentPlaying.al?$store.state.playing.currentPlaying.al.picUrl:''})`}"
                    >
                        <div></div>
                    </div>
                    <transition
                        name="playing-title"
                        mode="out-in"
                    >
                        <div
                            class="player-playing-title"
                            @click="$router.push('/player/record')"
                            :key="$store.state.playing.currentPlaying.name"
                        >
                            {{$store.state.playing.currentPlaying.name}}
                        </div>
                    </transition>
                    <div
                        class="player-playing-button"
                        :style="{backgroundImage:'url(/static/icon/next.svg)'}"
                        @click="$store.dispatch('playing/nextSong')"
                    ></div>
                    <div
                        class="player-playing-button"
                        @click="$store.state.playing.pause?$store.commit('playing/play'):$store.commit('playing/pause')"
                        :style="{backgroundImage:$store.state.playing.isPlaying?'url(/static/icon/pause.svg)':'url(/static/icon/play.svg)',marginBottom:($store.state.playing.mini?20:10)+'px'}"
                    ></div>
                </div>

            </transition>
            <div
                class="player-playing-stick"
                :class="{'player-playing-stick-mini':$store.state.playing.mini}"
            >
            </div>
        </div>
        <transition name="progress-time">
            <div
                class="player-progress-time"
                v-if="showProgress"
                :style="{top:((progressPositionY > 460) ? 460 : progressPositionY)+'px'}"
            >{{progressPositionY/500*$store.state.playing.duration|timeParse}}</div>
        </transition>
        <div
            v-if="!$store.state.playing.off"
            class="player-progress"
            @mousemove.self="setProgress"
            @mouseout.self="hideProgress"
            @click.stop="seekProgress"
            :style="{pointerEvents:$store.state.playing.currentPlaying?'':'none'}"
        >
            <div
                class="player-progress-current"
                :style="{height: ($store.state.playing.progress/$store.state.playing.duration) * 100 + '%'}"
            >
            </div>
        </div>
        <div
            class="player-main"
            v-if="!$store.state.playing.off"
        >
            <!-- <input type="text"> -->
            <div class="player-tab">
                <div
                    class="player-tab-line"
                    :style="{ right:((tabIndex>=0)?((3-tabIndex)*30+8):-100)+'px' }"
                ></div>
                <input
                    type="text"
                    class="player-search"
                    v-model="filter"
                    placeholder="⚲"
                    @keydown.enter="$router.push(`/player/search?t=${$event.target.value}`);$store.commit('playing/setFilter','')"
                >
                <span style="flex:auto"></span>
                <div
                    class="player-tab-item"
                    :class="{'player-tab-current':(item.name==$route.name)}"
                    v-for="item in tabs"
                    :key="item.name"
                    @click="$router.push(item.route)"
                    :style="{backgroundImage:`url(${item.icon})`}"
                ></div>
            </div>
            <transition
                name="page-switch"
                mode="out-in"
            >
                <router-view :style="{transition: 'all 0.2s'}"></router-view>
            </transition>
        </div>
    </div>
</template>
<style>
    .playing-enter,
    .playing-leave-to {
        opacity: 0;
        transform: translateY(20px);
    }
    .playing-title-enter,
    .playing-title-leave-to {
        opacity: 0;
        transform: translateY(20px);
    }
    .progress-time-enter,
    .progress-time-leave-to {
        opacity: 0;
        transform: translateX(10px);
    }
    .page-switch-enter,
    .page-switch-leave-to {
        opacity: 0;
    }
    .player {
        display: flex;
        flex-direction: row-reverse;
        height: 100%;
        width: 100%;
        /* background: rgba(255, 0, 0, 0.5) */
    }
    .player-bar {
        right: 0;
        top: 0;
        width: 50px;
        height: 100%;
        flex-shrink: 0;
        padding-top: 30px;
        display: flex;
        flex-direction: column;
        position: relative;
        -webkit-app-region: no-drag;
        position: relative;
        /* background: rgba(128, 128, 255, 0.5) */
    }
    .player-search {
        width: 30px;
        -webkit-app-region: no-drag;
        border: none;
        color: #ccc;
        border: 1.5px solid currentColor;
        border-image-source: linear-gradient(
            transparent,
            transparent 68%,
            currentColor 68%,
            currentColor
        );
        text-indent: 0.5em;
        border-image-slice: 20;
        outline: none;
        line-height: 25px;
        font-family: "思源黑体-瘦";
        font-weight: 100;
        font-size: 12px;
        transition: all 0.3s;
        position: relative;
    }
    .player-search::placeholder {
        color: currentColor;
        font-size: 20px;
        transform: translateY(2px) rotateZ(-45deg);
        transform-origin: center;
    }
    .player-search:focus,
    .player-search:hover,
    .player-search:not(:placeholder-shown) {
        flex: 10 0 auto;
        color: #000;
    }
    .player-progress {
        width: 3px;
        height: 100%;
        background: #000;
        flex-shrink: 0;
        -webkit-app-region: no-drag;
        transition: all 0.3s;
        position: relative;
        z-index: 101;
    }
    .player-progress:hover {
        width: 8px;
    }
    .player-progress-current {
        width: 100%;
        background: #ccc;
        transition: height 0.1s;
        pointer-events: none;
    }
    .player-progress-time {
        transition: all 0.3s;
        position: fixed;
        pointer-events: none;
        font-family: "Ruda";
        background: #000;
        color: rgba(255, 255, 255, 1);
        z-index: 100;
        font-size: 14px;
        height: 2em;
        line-height: 2em;
        text-align: center;
        width: 50px;
        left: 250px;
    }
    .player-playing {
        height: 250px;
        display: flex;
        flex-direction: column;
        align-items: center;
        /* font-family: "FZPingXianYaSongS-R-GB"; */
        /* font-family: "Source Sans"; */
        font-size: 14px;
        justify-content: flex-end;
        position: relative;
    }
    .player-minify {
        position: absolute;
        background: #000;
        height: 40px;
        width: 12px;
        top: 150px;
        left: 0;
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 100;
    }
    .player-bar:hover > .player-minify {
        opacity: 0.2;
    }
    .player-minify:hover {
        opacity: 1 !important;
        background: #000;
    }
    .player-playing-background {
        position: absolute;
        height: 100%;
        width: 100%;
        background-position: center;
        background-size: cover;
        filter: blur(3px);
        transition: all 0.3s;
    }
    .player-playing-background > div {
        height: 100%;
        width: 100%;
        background: linear-gradient(
            140deg,
            rgba(255, 255, 255, 1),
            rgba(255, 255, 255, 1) 30%,
            rgba(255, 255, 255, 0.3) 70.71%
        );
    }
    .player-playing-title {
        position: relative;
        z-index: 1;
        writing-mode: vertical-rl;
        text-orientation: sideways-right;
        line-height: 50px;
        text-align: right;
        margin-bottom: 15px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        text-shadow: rgba(255, 255, 255, 0.8) 0 0 8px;
        /* max-width: 1em; */
        transition: all 0.3s;
        user-select: none;
        cursor: default;
    }
    .player-playing-button {
        height: 35px;
        width: 50px;
        background-size: 28px 28px;
        background-position: center center;
        background-repeat: no-repeat;
        position: relative;
        z-index: 1;
        flex-shrink: 0;
        transition: all 0.3s;
    }
    .player-playing-title:hover,
    .player-playing-button:hover {
        /* opacity: 0.5; */
        filter: drop-shadow(rgba(100, 100, 100, 1) 0 0 3px);
    }
    .player-playing-stick {
        height: 10px;
        width: 50px;
        flex-shrink: 0;
        z-index: 101;
        /* border-radius: 5px; */
        -webkit-app-region: drag;
        opacity: 0;
        position: absolute;
        bottom: 0;
        left: 0;
    }
    .player-playing-stick-mini {
        background: #fff;
        box-shadow: rgba(100, 100, 100, 1) 0 0 8px 1px;
        opacity: 1;
        /* filter: drop-shadow(rgba(0, 0, 0, 1) 0 -5px 5px); */
    }
    .player-main {
        flex-grow: 1;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .player-tab {
        height: 50px;
        width: calc(100% - 50px);
        align-self: flex-end;
        /* background: rgba(0, 0, 0, 0.5); */
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 8px;
        position: relative;
        flex-shrink: 0;
    }
    .player-tab-item {
        height: 30px;
        width: 30px;
        background-repeat: no-repeat;
        background-position: center center;
        -webkit-app-region: no-drag;
        overflow: visible;
        transition: all 0.3s;
    }
    .player-tab-line {
        position: absolute;
        top: 10px;
        background: #000;
        height: 30px;
        width: 30px;
        /* border-radius: 50%; */
        transition: all 0.5s;
        pointer-events: none;
        /* box-shadow: 0px 0px 5px 5px #000; */
    }
    .player-tab-item:hover {
        transform: translateY(-3px);
    }
    .player-tab-current {
        transform: none !important;
        filter: brightness(0) invert(1);
    }
</style>
<script>
    import volume from "@/components/buttons/VolumeButton"
    export default {
        components: {
            volume: volume
        },
        computed: {
            tabIndex() {
                return this.tabs.findIndex(item => item.name == this.$route.name)
            },
            filter: {
                get() {
                    return this.$store.state.playing.filter
                },
                set(value) {
                    this.$store.commit("playing/setFilter", value)
                }
            }
        },
        methods: {
            setProgress(event) {
                this.showProgress = true
                this.progressPositionY = event.clientY
            },
            hideProgress(event) {
                this.showProgress = false
            },
            seekProgress(event) {
                this.$store.commit("playing/seek", event.clientY / 500 * this.$store.state.playing.duration)
            }
        },
        filters: {
            timeParse(second) {
                return `${Math.floor(second / 60)}:${Math.floor(second % 60) > 9 ? "" : "0"}${Math.floor(second % 60)}`
            }
        },
        data() {
            return {
                showProgress: false,
                progressPositionY: 0,
                tabs: [
                    {
                        name: "search",
                        icon: "/static/icon/search.svg",
                        route: "/player/search"
                    },
                    {
                        name: "collection",
                        icon: "/static/icon/collection.svg",
                        route: "/player/collection"
                    },
                    {
                        name: "fm",
                        icon: "/static/icon/fm.svg",
                        route: "/player/fm"
                    },
                    {
                        name: "option",
                        icon: "/static/icon/option.svg",
                        route: "/player/option"
                    },
                ]
            }
        }
    }
</script>

