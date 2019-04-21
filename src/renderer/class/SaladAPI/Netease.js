import request from "NeteaseCloudMusicApi/util/request"
import login from "NeteaseCloudMusicApi/module/login_cellphone"
import login_status from "NeteaseCloudMusicApi/module/login_status"
import userPlaylist from "NeteaseCloudMusicApi/module/user_playlist"
import playlistSongs from "NeteaseCloudMusicApi/module/playlist_detail"
import songUrl from "NeteaseCloudMusicApi/module/song_url"
import search from "NeteaseCloudMusicApi/module/search"


export class Netease {
    async getLoginStat(auth) {
        return await login_status(auth, request)
    }
    async phoneLogin(phone, password) {
        return await login({ phone: phone, password: password }, request)
    }
    async getPlaylists(auth) {
        if (!auth) {
            return
        }
        let result = await userPlaylist({ uid: auth.body.account.id }, request)
        return result.body.playlist
    }
    async getPlaylistSongs(id) {
        let result = await playlistSongs({ id: id }, request)
        return result.body.playlist.tracks.map(item => {
            item.platform = "netease"
            return item
        })
    }
    async getSongUrl(id, auth) {
        // auth['MUSIC_U'] = "4a0e5a8ea044999d0fcec9f2e823897678f0238cbe403e6b9be7b6bb55ddf3676a749d6dc5c25fc142a11c8b0b39988c41049cea1c6bb9b6"
        let result = await songUrl({ id: id, br: 999000, cookie: auth }, request)
        return result.body.data[0].url
        // return `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    }
    async getLikes(auth) {

    }
    async searchForSongs(text) {
        let result = await search({ keywords: text, type: 1, limit: 100, offset: 0 }, request)
        console.log(result)
        return result.body.result.songs.map(item => {
            item.platform = "netease"
            return item
        })
    }
}

export default new Netease()