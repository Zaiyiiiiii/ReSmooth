<template>
    <div id="app" :class="{'app-mini':$store.state.playing.mini}">
        <router-view></router-view>
    </div>
</template>
<script>
    // 功能按钮中应该包含固定的关闭和最小化，其余的按钮由路由决定。[...routeButton,min,close]
    import auth from "@/class/auth"
    import { Salad } from "@/class/SaladAPI/Salad"
    export default {
        name: "smooth",
        async beforeCreate() {
            let hasAuth = await auth.hasAuth(true)
            console.log(hasAuth)
            this.$store.state.salad = new Salad(await (hasAuth ? auth.getAuth() : undefined))
            this.$store.dispatch("playing/initPlayer")
            if (hasAuth) {
                this.$router.push("/player")
                return
            }
            else {
                this.$router.push("/login")
            }
        },
        created(){

        },
        mounted() {
        }
    };
</script>
<style>
    * {
        box-sizing: border-box;
        /* font-family: "Source Han Sans SC"; */
    }
    body,
    html {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        -webkit-app-region: drag;
        transition: all 0.3s;
        overflow: hidden;
        display: flex;
        justify-content: flex-end;
        background: transparent
    }
    #app {
        width: 100%;
        height: 100%;
        overflow: hidden;
        font-family: "思源黑体";
        font-weight: normal;
        color: #000;
        background-color: rgba(255, 255, 255, 1);
        transition: opacity 0.3s, background-color 0.2s;
        /* border: 1px solid rgba(175, 71, 71, 0.3); */
    }
    .app-enter-active,
    .app-leave-active {
        transition: all 0.5s;
    }
    .app-enter,
    .app-leave-to {
        opacity: 0;
        transform: scale(1.1);
    }
    .app-mini{
        opacity: 0.5;
    }
    .app-mini:hover{
        opacity: 1;
    }
</style>
