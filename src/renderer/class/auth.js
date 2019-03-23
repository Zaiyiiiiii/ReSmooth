const authKey = ["auth_netease", "auth_xiami"]
import store from 'localforage'

class Auth {
    async getAuth(verify) {
        //首先，检查本地的各个平台是否有Token，如果Verify为True则重新在线验证一遍，如失效则删除之。返回各平台的结果，如：{netease:true,xiami:false}等，无意外则为True，失效或无Token返回False。
        let result = {}
        for (let key of authKey) {
            result[key.split("_")[1]] = await store.getItem(key) || false
        }
        return result
    }
    async hasAuth() {
        let auth = await this.getAuth(false)
        return Object.keys(auth).reduce((pre, curr) => {
            return (auth[curr] ? true : false) || pre
        }, false)
    }
    async getExistAuth() {
        let auth = await this.getAuth(false)
        return Object.keys(auth).filter((a) => {
            return auth[a] ? true : false
        })
    }
    setAuth(platform, token) {
        store.setItem(`auth_${platform}`, token)
    }
}

export default new Auth()

