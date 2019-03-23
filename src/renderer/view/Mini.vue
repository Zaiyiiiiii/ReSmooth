<template>
    <div class="player-mini">
        <div ref="player-body" @mouseover="mouseIn($event)" @mouseout.prevent.self.stop="mouseOut($event)" class="player-mini-body" :style="miniWindowStyle">
        </div>
        <div class="player-mini-control" @mouseover="mouseIn($event)" @mouseout.prevent.self.stop="mouseOut($event)" :class="{'player-mini-control-show':showControl}" :style="miniWindowStyle">
        </div>
    </div>
</template>
<style>
    .player-mini {
        /* background: red; */
        position: relative;
        height: 100vh;
        width: 100vw;
    }
    .player-mini-body {
        position: relative;
        /* height: 50%;
             width: 50%; */
        background: blue;
        z-index: 10;
    }
    .player-mini-control {
        position: absolute;
        top: 0;
        left: 0;
        height: 50%;
        width: 50%;
        background: yellow;
        z-index: 1;
        transition: all 0.3s;
    }
    .player-mini-control-show {
        transform: translateY(40px);
    }
</style>
<script>
    import { Drag } from "../../tools/drag"
    import config from "../../config.json"
    export default {
        mounted() {
            let dragf = new Drag(this.$refs["player-body"])
            dragf.init();
        },
        data() {
            return {
                win: require("electron").remote.getCurrentWindow(),
                showControl: false,
                miniWindowStyle: {
                    width: config.system["player-mini-width"] + "px",
                    height: config.system["player-mini-height"] + "px",
                    top: config.system["player-mini-padding"] + "px",
                    left: config.system["player-mini-height"] + "px"
                }
            };
        },
        methods: {
            mouseIn(event) {
                console.log("in");
                console.log(event);
                this.win.setIgnoreMouseEvents(false);
                this.showControl = true;
            },
            mouseOut(event) {
                console.log(event.relatedTarget);
                console.log("out");
                this.win.setIgnoreMouseEvents(true, { forward: true });
                this.showControl = false;
            }
        }
    };
</script>


