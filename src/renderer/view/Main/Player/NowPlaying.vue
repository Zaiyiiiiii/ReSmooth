<template>
    <div class="playing" v-if="$store.state.playing.playing">
        <!-- <div class="playing-coverContainer">

        </div> -->
        <div class="playing-origin" :style="{color:textColor}" @click="$router.push($store.state.playing.origin.link)">
            ♫ 正在播放：{{$store.state.playing.origin.name}} 🗏 playlist
        </div>
        <div class="playing-main playing-playing">
            <div class="playing-cover" :style="{color:textColor,backgroundImage:$store.state.playing.playingInfo?`url('${$store.state.playing.playingInfo.album.coverlink}')`:''}">

            </div>
            <div class="playing-info">
                <span class="playing-info-name" :style="{color:textColor}">{{$store.state.playing.playingInfo.name}}</span>
                <span class="playing-info-album" :style="{color:textColor}">{{$store.state.playing.playingInfo.album.name}}</span>
                <span class="playing-info-album" :style="{color:textColor}">
                    {{$store.state.playing.playingInfo.artists.reduce((pre,artist)=>{ return pre + (pre? " & ":"" )+ artist.name},'')}}
                </span>
            </div>
        </div>
        <div class="playing-progress" :style="{color:textColor}">
            <seeker @hover="seekHover" @seek="seek" style="width:100%; height:2em" :duration="$store.getters['playing/duration']" :progress="progress"></seeker>
            <div style="user-select:none;cursor:default;font-size:0.8em;padding-left:0.5em;line-height:2.3em;">{{(hoverProgress||progress)|secToTime}}</div>
        </div>
        <div class="playing-control">
            <span @click="$store.commit(`playing/${$store.state.playing.pause?'play':'pause'}`)">{{$store.state.playing.pause?"播放":"暂停"}}</span>
            <span @click="$store.dispatch('playing/nextSong')">下一曲</span>
            <span>上一曲</span>
            <span>模式</span>
            <span>收藏</span>
        </div>
    </div>
    <div class="playing" v-else>
        <svg :style="{transform:'translateY(-1px)',top:'-0.1em'}" class="icon" :width="'1.4em'" :height="'1.4em'" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path :fill="mainColor" d="M934.331 276.701h-734.469l158.451-158.451c19.263-19.263 19.263-50.954 0-70.215s-50.332-19.263-70.215 0l-227.425 228.046c-25.476 22.991-25.476 62.758-25.476 77.052v574.774c0 27.341 22.37 49.711 49.711 49.711h849.424c27.341 0 49.711-22.37 49.711-49.711v-601.494c-0.621-27.341-22.37-49.711-49.711-49.711zM296.796 761.376c-70.837 0-128.626-57.788-128.626-128.626 0-70.837 57.167-128.626 128.626-128.626 70.837 0 128.626 57.788 128.626 128.626-0.621 70.837-57.788 128.626-128.626 128.626zM829.94 770.696h-257.25c-16.156 0-29.826-13.050-29.826-29.826 0-16.156 13.050-29.826 29.826-29.826h257.25c16.156 0 29.826 13.050 29.826 29.826 0 16.778-13.67 29.826-29.826 29.826zM829.94 569.991h-257.25c-16.156 0-29.826-13.050-29.826-29.826 0-16.156 13.050-29.826 29.826-29.826h257.25c16.156 0 29.826 13.67 29.826 29.826 0 16.778-13.67 29.826-29.826 29.826z" />
        </svg>
    </div>
</template>
<script>
    import theme from "@/mixins/theme"
    import seeker from "@/components/Seeker"
    export default {
        mixins: [theme],
        filters: {
            secToTime(sec) {
                let time = Math.round(sec)
                return `${Math.floor(time / 60)}:${(time % 60) < 10 ? "0" : ""}${time % 60}`
            }
        },
        components: {
            seeker: seeker
        },
        computed: {
            // progress() {
            //     return this.$store.state.playing.playing.currentTime
            // }
        },
        data() {
            return {
                seekId: undefined,
                hoverProgress: false,
                progress: undefined
            }
        },
        mounted() {
            this.seekId = setInterval(() => {
                if (this.$store.state.playing.isPlaying && !this.$store.state.playing.playing.paused) {
                    this.progress = this.$store.state.playing.playing.currentTime
                }
                else if (this.$store.state.playing.pause) {

                }
                else {
                    this.progress = null
                }
            }, 500)
        },
        beforeDestroy() {
            clearInterval(this.seekId)
        },
        methods: {
            seek(sec) {
                console.log(sec)
                this.$store.commit("playing/seek", sec)
            },
            seekHover(progress) {
                this.hoverProgress = progress
            }
        }
    }
</script>

<style>
    .playing {
        width: 100%;
        display: flex;
        height: 100%;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;
        -webkit-app-region: no-drag;
    }
    .playing-cover {
        margin-top: 1em;
        width: 200px;
        height: 200px;
        background-size: cover;
        /* border-radius: 10px; */
        /* box-shadow: 0 0px 15px -2px currentColor; */
        box-shadow: 0 3px 25px 2px hsla(0, 0%, 38%, 0.75);
        transition: all 0.5s;
    }
    .playing-main {
        width: 100%;
        flex: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .playing-playing {
        justify-content: flex-end;
    }
    .playing-control {
        height: 3em;
        line-height: 2em;
        padding-bottom: 1em;
    }
    .playing-origin {
        margin-top: 1.5em;
        cursor: pointer;
        text-align: center;
        align-self: center;
        border-radius: 1.5em;
        font-size: 0.8em;
        padding: 0.5em 0;
        transition: background-color 0.3s;
    }
    .playing-origin:hover {
        background-color: rgba(255, 255, 255, 0.08);
        opacity: 0.8;
    }
    .playing-progress {
        margin-top: 0.5em;
        width: calc(100% - 2.5em);
        padding: 0 1em;
        display: flex;
        height: 2em;
        border-radius: 1em;
        flex-shrink: 0;
    }
    .playing-progress:hover {
        background-color: rgba(255, 255, 255, 0.08);
    }
    .playing-info {
        width: 100%;
        padding: 0 2.5em;
    }
    .playing-info-name {
        -webkit-app-region: no-drag;
        width: 100%;
        display: block;
        margin-top: 1em;
        font-size: 1em;
        line-height: 1.4em;
        max-height: 1.4em;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        transition: all 0.5s;
    }
    .playing-info-name:hover {
        height: auto;
        max-height: 100vh;
        overflow: visible;
        white-space: normal;
    }
    .playing-info-album {
        display: block;
        font-size: 0.7em;
        margin-top: 0.2em;
        opacity: 0.5;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>

