<template>
    <div class="player">
        <div class="player-bar">

        </div>
        <div class="player-progress">

        </div>
        <div class="player-main">
            <div class="player-tab-line"></div>
            <div class="player-tab">
                <div class="player-tab-item" :class="{'player-tab-current':(item.name==$route.name)}" v-for="item in tabs" :key="item.name" @click="$router.push(item.route)" :style="{backgroundImage:'url(${item.icon})'}"></div>
            </div>
            <router-view></router-view>
        </div>
    </div>
</template>
<style>
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
        /* background: rgba(128, 128, 255, 0.5) */
    }
    .player-progress {
        width: 3px;
        height: 100%;
        background: #000;
        flex-shrink: 0;
    }
    .player-main{
        flex-grow: 1 1 auto;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .player-tab{
        height: 50px;
        width: calc(100% - 50px);
        align-self: flex-end;
        /* background: rgba(0, 0, 0, 0.5); */
        display:flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 0.5em;
        position: relative;
    }
    .player-tab-item{
        height: 30px;
        width: 30px;
        background-repeat: no-repeat;
        background-position: center center;
        -webkit-app-region: no-drag;
        overflow: visible;
        transition: transform 0.3s;
    }
    .player-tab-line{
        position: absolute;
        right: 136px;
        top:40px;
        border-bottom: 2px solid #000;
        height: 2px;
        width: 20px;
    }
    .player-tab-item:hover{
        transform: translateY(-4px)
    }
    .player-tab-current{
        transform: translateY(-4px);
        border-bottom: 5px;
    }
</style>
<script>
    export default {
        computed:{
            tabIndex(){
                this.tabs.findIndex(item=>item.name==this.$route.name)
            }
        },
        data(){
            return {
                tabs:[
                    {
                        name: "search",
                        icon:"/static/icon/search.svg",
                        route:"/player/search"
                    },
                    {
                        name: "collection",
                        icon:"/static/collection.svg",
                        route:"/player/collection"
                    },
                    {
                        name: "fm",
                        icon:"/static/fm.svg",
                        route:"/player/fm"
                    },
                    {
                        name: "option",
                        icon:"/static/option.svg",
                        route:"/player/option"
                    },
                ]
            }
        }
    }
</script>

