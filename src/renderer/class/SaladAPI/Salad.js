import netease from "./Netease"
export class Salad {
    constructor(auth) {
        if (auth) {
            this.auth = auth
            for (let item in auth) {
                if (!auth[item]) {
                    delete auth[item]
                }
            }
        }
    }
    updateAuth(auth) {
        this.auth = auth
        for (let item in auth) {
            if (!auth[item]) {
                delete auth[item]
            }
        }
    }
    async login(platform, user, pass) {
        if (platform == "netease") {
            return await netease.phoneLogin(user, pass)
        }
    }
    async getPlaylists() {
        return await netease.getPlaylists(this.auth["netease"])
    }
    async getPlaylistSongs(id) {
        return await netease.getPlaylistSongs(id)
    }
    async getSongUrl(song){
        if(song.platform == "netease"){
            return netease.getSongUrl(song.id,this.auth["netease"])
        }
    }
    async search(text){
        return await netease.searchForSongs(text,this.auth["netease"])
    }
}