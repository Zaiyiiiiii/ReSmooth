<template>
    <div class="record">
        <div class="record-tools">
            <div
                class="record-mode"
                @click="changeMode"
            >
                <div class="record-tip">播放模式
                    <transition
                        mode="out-in"
                        name="fade"
                    >
                        <span :key="modes[currentMode].id">{{modes[currentMode].text}}</span>
                    </transition>
                </div>
                <transition
                    mode="out-in"
                    name="fade"
                >
                    <span :key="modes[currentMode].id">
                        {{modes[currentMode].name}}
                    </span>
                </transition>
            </div>
            <div
                class="record-mode"
                @click="jumpToCurrent"
            >
                <div class="record-tip">
                    跳至正在播放
                </div>
                <span>·</span>
            </div>
            <div
                class="record-mode"
                @click="$store.commit('playing/clearPlaylist')"
            >
                <div class="record-tip">
                    清空播放队列
                </div>
                <span>Clear</span>
            </div>
        </div>
        <div
            class="record-list"
            ref="list"
        >
            <div
                v-if="showAllHistory == false"
                style="text-align:center;width:100%;font-size:12px;color:#ccc;cursor:pointer"
                @click="showAllHistory = true"
            >显示所有历史</div>
            <div
                class="record-list-item record-list-history"
                v-for="item in showAllHistory?history:history.slice(-7,-1)"
                :key="item.id"
            >
                <span>{{item.time.getFullYear()+"."+item.time.getMonth()+"."+item.time.getDate()+" "+item.time.getHours()+":"+item.time.getMinutes()+":"+item.time.getSeconds()}}</span>
                <span class="record-list-title">
                    {{item.song.name}}</span>
            </div>
            <div
                ref="current"
                v-if="currentPlaying"
                class="record-list-item record-current"
            >
                <span class="record-list-info">正在播放</span>
                <span class="record-list-title">
                    {{currentPlaying.name}}
                </span>
            </div>
            <div
                class="record-list-item"
                v-for="(item,index) in $store.state.playing.playlist"
                :key="index"
            >
                <span
                    class="record-list-delete"
                    @click="deletePlaylist(index)"
                >×</span>
                <span class="record-list-title">
                    {{item.name}}</span>
            </div>
        </div>
    </div>
</template>
<style>
    @keyframes toolsIn {
        0% {
            left: -50px;
        }
        100% {
            left: 15px;
        }
    }
    .fade-enter,
    .fade-leave-to {
        opacity: 0;
        transform: translateX(5px);
    }
    .record {
        overflow: hidden;
        height: 100%;
        width: 100%;
        position: relative;
        /* direction: rtl; */
        padding-right: 16px;
        padding-left: 18px;
    }
    .record-tools {
        position: absolute;
        bottom: 15px;
        left: 15px;
        height: 30px;
        width: 92px;
        background: black;
        /* opacity: 0.2; */
        transition: all 0.2s;
        animation: toolsIn 0.5s;
        color: #fff;
        display: flex;
        align-items: center;
        z-index: 1;
    }
    .record-mode {
        font-family: "RopaSans";
        font-size: 12px;
        line-height: 30px;
        cursor: pointer;
        user-select: none;
        text-align: center;
        width: 30px;
    }
    .record-mode:active {
        text-shadow: #fff 0 0 5px;
    }
    .record-mode > span {
        transition: all 0.2s;
    }
    .record-tip {
        position: absolute;
        left: 5px;
        bottom: 27px;
        color: #000;
        font-family: "思源黑体";
        pointer-events: none;
        opacity: 0;
        transition: all 0.2s;
        text-shadow: rgba(180, 180, 180, 1) 0 0 2px;
    }
    .record-mode:hover > .record-tip {
        opacity: 1;
    }
    .record-list {
        height: 100%;
        width: 100%;
        overflow: hidden scroll;
        -webkit-app-region: no-drag;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        font-size: 14px;
        white-space: nowrap;
        font-family: "Arsenal", "Source Han Serif SC";
        font-weight: 400;
        line-height: 34px;
    }
    .record-list::-webkit-scrollbar {
        width: 0;
    }
    .record-current {
        color: #cc3737;
        font-size: 15px;
        font-weight: 500;
        line-height: 40px;
    }
    .record-list-item {
        display: flex;
        flex-shrink: 0;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
    }
    .record-list-delete {
        font-size: 26px;
        opacity: 0;
        transition: all 0.3s;
        transform: scaleX(1.15);
        cursor: pointer;
    }
    .record-list-item:hover > .record-list-delete {
        opacity: 1;
    }
    .record-list-history {
        color: #ccc;
    }
    .record-list-title {
        max-width: 12em;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .record-list-info {
        font-size: 11px;
        position: relative;
    }
</style>
<script>
    import Velocity from 'velocity-animate'
    import { setTimeout } from 'timers';
    export default {
        beforeMount() {
            this.currentMode = this.modes.findIndex(item => { return item.id == this.$store.state.playing.playmode })
            this.getHistory()
        },
        mounted() {
            this.jumpToCurrent()
        },
        computed: {
            currentPlaying() {
                return this.$store.state.playing.currentPlaying
            },
            historyCount() {
                return this.$store.state.playing.historyCount
            }
        },
        watch: {
            currentMode(value) {
                this.$store.commit("playing/setMode", this.modes[value].id)
            },
            historyCount() {
                this.getHistory()
            }
        },
        data() {
            return {
                currentMode: undefined,
                history: [],
                modes: [
                    {
                        name: "Rand",
                        text: "随机",
                        id: "random"
                    },
                    {
                        name: "Ordr",
                        text: "顺序",
                        id: "order"
                    },
                    {
                        name: "Rept",
                        text: "单曲",
                        id: "repeat"
                    }
                ],
                showAllHistory: false
            }
        },
        methods: {
            async getHistory() {
                this.history = await this.$store.dispatch('playing/getHistory')
                return this.history
            },
            changeMode() {
                if (this.currentMode >= (this.modes.length - 1)) {
                    this.currentMode = 0
                }
                else {
                    this.currentMode += 1
                }
            },
            jumpToCurrent() {
                this.$nextTick()
                let offset = this.$refs.current.offsetTop
                this.$refs.list.scrollTo({ left: 0, top: (offset - 40 * 4), behavior: "smooth" })
            },
            deletePlaylist(index) {
                console.log(index)
                this.$store.commit('playing/deletePlaylist', index)
            }
        }
    }   
</script>