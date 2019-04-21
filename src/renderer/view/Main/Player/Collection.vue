<template>
    <div class="collection">
        <transition-group
            name="slide-fade"
            tag="div"
            class="collection-songs"
            @after-enter="pageAfterEnter"
            @enter="pageEnter"
            @before-leave="pageBeforeLeave"
            @leave="pageLeave"
        >
            <div
                v-for="item in paginatedSongs || []"
                :key="item.id"
                class="collection-songs-item"
            >
                <span class="collection-songs-artist">{{item.ar[0].name}}</span>
                <span
                    class="collection-songs-title"
                    @mouseenter.once="calcOverflow($event,item.name)"
                    @click="$store.dispatch('playing/insertSong',item)"
                >{{item.name}}</span>
                <span
                    @click="$store.commit('playing/addSong',{song:item})"
                    class="collection-songs-add"
                >
                    +
                </span>
            </div>
            <div
                class="collection-pagination"
                key="unkey"
            >
                <transition
                    mode="out-in"
                    @after-enter="pageAfterEnter"
                    @enter="pageEnter"
                    @before-leave="pageBeforeLeave"
                    @leave="pageLeave"
                >
                    <div
                        class="collection-pagination-curr"
                        :key="currentPage"
                    >
                        {{currentPage}}
                    </div>
                </transition>
                <div class="collection-page-switch">
                    <span
                        @click="changePage(currentPage-1)"
                        :class="{'collection-page-switch-disable':currentPage==1}"
                    >⇃</span>
                    <span
                        @click="changePage(currentPage+1)"
                        :class="{'collection-page-switch-disable':currentPage==totalPage}"
                    >↾</span>
                </div>
                <div
                    class="collection-currentlist-icon"
                    @click="showPlaylists = !showPlaylists"
                    :style='{backgroundImage: "url(/static/icon/playlist.svg)"}'
                ></div>
                <div
                    class="collection-currentlist-icon"
                    @click="$store.dispatch('playing/insertSong',currentPlaylist)"
                    :style='{backgroundImage: "url(/static/icon/playall.svg)"}'
                ></div>
                <!-- <div class="collection-currentlist">{{currentPlaylistName}}
                </div> -->
                <span></span>
                <paginia
                    v-model="currentPage"
                    :total="totalPage"
                ></paginia>
            </div>
        </transition-group>
        <div
            class="collection-playlist"
            v-if="showPlaylists"
            @click="showPlaylists = !showPlaylists"
        >
            <div
                :class="{'collection-playlist-current':item.id==currentPlaylistId}"
                class="collection-playlist-item"
                v-for="item in playlists"
                :key="item.id"
                @click="currentPlaylistId = item.id"
            >
                {{item.name}}
            </div>
        </div>
    </div>
</template>
<style>
    @keyframes scrolltext {
        0% {
            transform: translateX(100%);
        }
        100% {
            transform: translateX(-100%);
        }
    }
    .slide-fade-enter-active,
    .slide-fade-leave-active {
        transition: all 0.2s;
    }
    .slide-fade-enter-active {
        transition-delay: 0s;
    }
    .slide-fade-enter,
    .slide-fade-leave-to {
        opacity: 0;
        transform: translateX(10px);
    }
    .collection {
        display: flex;
        width: 100%;
        height: 100%;
        flex-grow: 0;
        position: relative;
        flex-direction: column;
    }
    .collection-currentlist-icon {
        -webkit-app-region: no-drag;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        height: 16px;
        width: 16px;
        margin-left: 8px;
        position: relative;
        top: 1px;
        flex-shrink: 0;
    }
    .collection-songs {
        /* background: rgba(255, 0, 0, 0.5); */
        flex-grow: 1;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        white-space: nowrap;
        padding-right: 1.2em;
        padding-top: 0.2em;
        padding-left: 1em;
        position: relative;
    }
    .collection-songs-item {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        height: 1.62em;
        overflow: hidden;
        width: 100%;
        -webkit-app-region: no-drag;
        flex-shrink: 0;
        transition: all 0.2s;
        cursor: pointer;
    }
    .collection-songs-title:hover {
        opacity: 0.5 !important;
    }
    .collection-songs-title {
        font-family: "FZPingXianYaSong";
        font-size: 12px;
        flex-shrink: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        /* max-width: 11em; */
    }
    .collection-songs-artist {
        font-family: "思源黑体";
        font-size: 10px;
        flex-shrink: 1;
        color: #b79090;
        margin-right: 0.7em;
        /* opacity: 0; */
        min-width: 3em;
        /* transform: translateX(100%); */
        transition: all 0.3s;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .collection-songs-add {
        opacity: 0;
        transition: all 0.3s;
    }
    .collection-songs-item:hover > .collection-songs-add {
        opacity: 1;
    }
    .collection-songs-item:hover > .collection-songs-title {
        text-overflow: clip;
    }
    .collection-pagination {
        display: flex;
        position: absolute;
        bottom: 20px;
        left: 0;
        width: 100%;
        height: 20px;
        align-items: flex-end;
    }
    .collection-page-switch {
        display: flex;
        -webkit-app-region: no-drag;
        margin-left: 0.5em;
        font-size: 1.2em;
        transform: translateY(7px) rotateZ(90deg);
        word-spacing: 1em;
    }
    .collection-page-switch-disable {
        color: #ccc;
        pointer-events: none;
    }
    .collection-page-switch > span {
        display: flex;
        flex-direction: column;
        align-items: center;
        user-select: none;
        cursor: pointer;
    }
    .collection-page-switch > span:hover {
        transform: scale(1.2);
    }

    .collection-pagination > .paginia {
    }
    .collection-pagination > span {
        flex: auto;
    }
    .collection-pagination-curr {
        width: 39px;
        text-align: right;
        font-size: 15px;
        line-height: 15px;
        transition: all 0.1s;
        flex-grow: 0;
    }
    .collection-playlist {
        background: rgba(255,255,255,0.95);
        position: absolute;
        bottom: 0;
        left: 0;
        height: 300px;
        width: 100%;
        -webkit-app-region: no-drag;
        padding: 1em;
    }
    .collection-playlist-item {
        font-size: 12px;
        /* font-family: "FZCuJinLJW"; */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 0.5em;
        cursor: pointer;
        color: #a8a8a8;
        transition: all 0.2s;
    }
    .collection-playlist-current {
        color: #000;
    }
</style>
<script>
    import paginia from "@/components/Paginia"
    import { setTimeout } from 'timers';
    import { cursorTo } from 'readline';
    // import Velocity from 'velocity-animate'
    export default {
        components: {
            paginia: paginia
        },
        mounted() {
            this.loadPlaylist()
        },
        computed: {
            currentPlaylistName() {
                let list = this.playlists.find(item => item.id == this.currentPlaylistId)
                return list ? list.name : "哦噢"
            },
            paginatedSongs() {
                return this.filteredPlaylist.slice((this.currentPage - 1) * 15, this.currentPage * 15)
            },
            totalPage() {
                return Math.ceil(this.filteredPlaylist.length / 15)
            },
            filteredPlaylist(){
                return this.currentPlaylist.filter((item)=>{
                    let filter = this.$store.state.playing.filter.toLowerCase()
                    return item.name.toLowerCase().indexOf(filter)!=-1
                })
            }
        },
        watch: {
            currentPlaylistId() {
                this.getCurrentPlaylist()
                this.currentPage = 1
            },
            currentPage(to, from) {
                this.pageDirction = (from > to ? "left" : "right")
            },
            filteredPlaylist(){
                this.currentPage = 1
            }
            // currentPlaylistName() {
            //     if (this.$refs.playlistname) {
            //         Velocity(this.$refs.playlistname, "stop", true)
            //         Velocity(this.$refs.playlistname, { opacity: 0, left: 0 })
            //             .velocity({
            //                 opacity: 1,
            //             }, { duration: 500 })
            //             .velocity({ opacity: 1 }, { duration: 2000 })
            //             .velocity({ left: `-100%` }, { duration: 5000 })
            //             .velocity({ opacity: 0, left: 0 })
            //     }
            // }
        },
        methods: {
            async loadPlaylist() {
                if (!this.$store.state.salad) {
                    setTimeout(this.loadPlaylist, 500)
                    return
                }
                this.playlists = await this.$store.state.salad.getPlaylists()
                this.currentPlaylistId = this.playlists[0].id
            },
            changePage(count) {
                let page = count
                if (page < 1) {
                    page = 1
                }
                if (page > this.totalPage) {
                    page = this.totalPage
                }
                this.currentPage = page
            },
            calcOverflow(event, name) {
                console.log("do")
                if (event.target.scrollWidth > event.target.offsetWidth) {
                    event.target.title = name
                }
            },
            async getCurrentPlaylist() {
                if (!this.currentPlaylistId) {
                    this.currentPlaylist = []
                }
                this.currentPlaylist = await this.$store.state.salad.getPlaylistSongs(this.currentPlaylistId)
            },
            pageAfterEnter(element) {
                element.style.transform = `translateX(0px)`
                element.style.opacity = 1
            },
            pageEnter(element) {
                element.style.transform = `translateX(${this.pageDirction == "left" ? "-" : ""}5px)`
                element.style.opacity = 0
            },
            pageBeforeLeave(element) {
                element.style.transform = `translateX(0px)`
                element.style.opacity = 1
            },
            pageLeave(element) {
                element.style.transform = `translateX(${this.pageDirction == "left" ? "" : "-"}5px)`
                element.style.opacity = 0

            }
        },
        data() {
            return {
                playlists: [],
                currentPlaylistId: undefined,
                currentPlaylist: [],
                currentPage: 1,
                pageDirction: "left",
                showPlaylists: false
            }
        }
    }
</script>
