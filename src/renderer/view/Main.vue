<template>
    <div class="main">
        <router-view></router-view>
        <close class="main-close"></close>
        <div v-if="!$store.state.playing.mini" class="main-smooth" :class="{'main-smooth-login':$route.path == '/login','main-smooth-min':$route.path != '/login'}">
            Smo
        </div>
    </div>
</template>
<style>
    .main {
        height: 100%;
        width: 100%;
        -webkit-app-region: drag;
    }
    .main-close{
        position: absolute;
        right: 0;
        top: 0;
    }
    .main-smooth{
        font-family: 'Rakkas';
        position: fixed;
        height: 50px;
        width: 50px;
        text-align: center;
        line-height: 50px;
        transition: all 0.5s;
        pointer-events: none;
    }
    .main-smooth-min{
        top: 0;
        left: 0;
        font-size: 16px;
    }
    .main-smooth-login{
        top: 110px;
        font-size: 36px;
        left: 1em;
    }
</style>
<script>
    import close from "@/components/buttons/CloseButton"
    export default {
        components:{
            close: close
        },
        mounted(){
        }
    }
</script>


