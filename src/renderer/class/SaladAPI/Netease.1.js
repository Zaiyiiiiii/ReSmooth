const neteaseBase = "http://music.163.com"
const apilist = {
    phoneLogin: "/weapi/login/cellphone",
    userPlaylist: "/weapi/user/playlist",
    userLikeList: "/weapi/song/like/get",
    playlistDetail: "/weapi/v3/playlist/detail",
    songUrl: "/weapi/song/enhance/player/url",
    search: "/weapi/cloudsearch/get/web",
    loginStat: "/"
}
const request = require('request-promise')
const queryString = require('querystring')
import { Encrypt } from './crypto'
import MD5 from 'md5'

const header = {
    Accept: '*/*',
    'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
    Connection: 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded',
    Referer: 'http://music.163.com',
    Host: 'music.163.com',
    Cookie: "",
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586'
}

function getAuth() {

}

function saveAuth() { }

// async function checkAuth() {
//     return await store.getItem("auth_netease") ? true : false
// }

async function neteaseRequest(login, method, path, postData, fullresponse) {
    // if (login && !await checkAuth()) {
    //     return { code: 401 }
    // }
    // let cookie = getCookie()
    header.Cookie = completeCookie(login.cookie.join(";")).map(x => x[0]).join('; ')
    const options = {
        url: `${neteaseBase}${path}`,
        headers: header,
        method: method,
        resolveWithFullResponse: fullresponse
    }
    if (method == 'POST') {
        const encryptedData = Encrypt(postData)
        Object.assign(options, {
            body: queryString.stringify({
                params: encryptedData.params,
                encSecKey: encryptedData.encSecKey
            })
        })
    }
    return request(options)
}

export class Netease {
    async getLoginStat(token) {
        let result = await neteaseRequest(token, 'GET', apilist.loginStat, false, true)
        console.log(result)
        try {
            let profile = eval(`(${/GUser\s*=\s*([^;]+);/.exec(result.body)[1]})`)
            let bindings = eval(`(${/GBinds\s*=\s*([^;]+);/.exec(result.body)[1]})`)
            result.body = { code: 200, profile: profile, bindings: bindings }
            console.log(result.body)
            return result
        }
        catch (err) {
            result.status = 301
            result.body = { code: 301 }
            return Promise.reject(result)
        }
    }
    async getSongUrl(id) {
        let postData = {
            ids: [id],
            br: 320000,
            csrf_token: ""
        }
        return await neteaseRequest(false, 'POST', apilist.songUrl, postData, false)
    }
    async search(keyword, type, startAt) {
        // 搜索类型；1: 单曲(默认), 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频
        let postData = {
            csrf_token: '',
            limit: 100,
            type: 1,
            s: keyword,
            offset: 0
        }
        return await neteaseRequest(false, 'POST', apilist.search, postData, false)
    }
    login() {
        //判断输入类型
        //等待返回结果
        //成功写入COOKIE进数据库
        //失败返回错误信息
        //如400，在UI中处理高频IP验证码
    }
    async getPlayListContent(id) {
        let postData = {
            id: id,
            n: 100000,
            s: 8,
            csrf_token: ""
        }
        return await neteaseRequest(false, 'POST', apilist.playlistDetail, postData, false)
    }
    async getHeart() {
        let postData = {
            offset: 0,
            limit: 300,
            uid: 20104200,
            csrf_token: ""
        }
        let res = await neteaseRequest(false, 'POST', apilist.userPlaylist, postData, false)
        let heartlistid = JSON.parse(res).playlist[0].id
        let result = await this.getPlayListContent(await heartlistid)
        return JSON.parse(result).playlist.tracks

    }
    loginCapcha() {
    }
    async phoneLogin(number, pass) {
        const postData = {
            "phone": number,
            "password": MD5(pass),
            "rememberLogin": "true"
        }
        let res = await neteaseRequest(false, 'POST', apilist.phoneLogin, postData, true)
        let resBody = JSON.parse(res.body)
        console.log(resBody)
        if (resBody.code == 200) {
            console.log("登陆成功")
            return { cookie: res.headers["set-cookie"], userinfo: "" }
        }
        throw new Error(resBody.msg)
    }
}


function randomString(pattern, length) {
    return Array.apply(null, { length: length }).map(() => (pattern[Math.floor(Math.random() * pattern.length)])).join('')
}

function completeCookie(cookie) {
    let origin = (cookie || '').split(/;\s*/).map(element => (element.split('=')[0])), extra = []
    let now = (new Date).getTime()

    if (!origin.includes('JSESSIONID-WYYY')) {
        let expire = new Date(now + 1800000) //30 minutes 
        let jessionid = randomString('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKMNOPQRSTUVWXYZ\\/+', 176) + ':' + expire.getTime()
        extra.push(['JSESSIONID-WYYY=' + jessionid])
    }
    if (!origin.includes('_iuqxldmzr_')) {
        let expire = new Date(now + 157680000000) //5 years
        extra.push(['_iuqxldmzr_=32', 'Expires=' + expire.toGMTString()])
    }
    if ((!origin.includes('_ntes_nnid')) || (!origin.includes('_ntes_nuid'))) {
        let expire = new Date(now + 3153600000000) //100 years
        let nnid = randomString('0123456789abcdefghijklmnopqrstuvwxyz', 32) + ',' + now
        extra.push(['_ntes_nnid=' + nnid, 'Expires=' + expire.toGMTString()])
        extra.push(['_ntes_nuid=' + nnid.slice(0, 32), 'Expires=' + expire.toGMTString()])
    }

    return extra
}

export default new Netease()