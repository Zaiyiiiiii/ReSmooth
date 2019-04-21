import Vue from 'vue'
// import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import { promises } from 'fs';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
// Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

let fonts = [
    {
        name: "PTSans",
        url: "url('/static/fonts/PT_Sans-Web-Regular.ttf')"
    },
    {
        name: "Rakkas",
        url: "url('/static/fonts/Rakkas-Regular.ttf')"
    },
    {
        name: "FZCuJinLJW",
        url: "url('/static/fonts/FZCuJinLJW.ttf')"
    },
    {
        name: "Armata",
        url: "url('/static/fonts/Armata-Regular.ttf')"
    },
    {
        name: "Ruda",
        url: "url('/static/fonts/Ruda-Regular.ttf')"
    },
    {
        name: "思源黑体",
        url: "url('/static/fonts/SourceHanSansSC-Regular.otf')"
    },
    {
        name: "思源黑体-瘦",
        url: "url('/static/fonts/SourceHanSansSC-Normal.otf')"
    },
    {
        name: "FZPingXianYaSong",
        url: "url('/static/fonts/FZPingXYSJW.TTF')"
    },
    {
        name: "Arsenal",
        url: "url('/static/fonts/Arsenal-Regular.ttf')"
    },
    {
        name: "RopaSans",
        url: "url('/static/fonts/RopaSans-Regular.ttf')"
    }
]

let Smooth

function loadFonts(faces) {
    let facesPromise = faces.map(item => {
        return new FontFace(item.name, item.url).load()
    })
    return facesPromise.reduce((pre, next) => {
        return pre.then(loadedFace => { 
            if(loadedFace){
                document.fonts.add(loadedFace)
            }
            return next
        })
    }, Promise.resolve())
}

loadFonts(fonts).then(loadedFace => {
    console.log(loadedFace)
    document.fonts.add(loadedFace)
    Smooth = new Vue({
        components: { App },
        router,
        store,
        template: '<App/>'
    }).$mount('#app')
})
