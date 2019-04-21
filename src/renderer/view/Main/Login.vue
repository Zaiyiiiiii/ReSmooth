<template>
    <div class="login">
        <div class="login-smooth">
            <span>o</span><span>t</span><span>h</span>
        </div>
        <form class="login-form">
            <input
                type="text"
                class="login-form-user"
                placeholder="Id"
                v-model="user"
            >
            <input
                type="password"
                class="login-form-pass"
                placeholder="Pass"
                v-model="pass"
            >
            <div class="login-form-platforms">
                <div
                    v-for="platform in platforms"
                    :key="platform.name"
                    :style="{backgroundImage:`url(${platform.icon})`,filter:platform.name==currentPlatform?'':'grayscale(1)'}"
                    @click="currentPlatform = platform.name"
                ></div>
            </div>
            <div
                class="login-form-go"
                @click="login"
            >
                登录 <div :style="{backgroundImage:`url(${platforms.find(platform=>platform.name==currentPlatform).text})`}"></div>
            </div>
        </form>
    </div>
</template>
<script>
    import auth from "@/class/auth"
    import { Salad } from "@/class/SaladAPI/Salad"
    export default {
        data() {
            return {
                currentPlatform: "netease",
                platforms: [
                    {
                        name: "netease",
                        icon: "static/netease.svg",
                        text: "static/neteaseText.svg"
                    },
                    {
                        name: "douban",
                        icon: "static/douban.svg",
                        text: "static/doubanText.svg"
                    }
                ],
                user: "",
                pass: ""
            }
        },
        methods: {
            async login() {
                let token
                try {
                    token = await this.$store.state.salad.login(this.currentPlatform, this.user, this.pass)
                    if (!await token) {
                        return
                    }
                }
                catch (err) {
                    console.error(err)
                    return
                }
                auth.setAuth(this.currentPlatform, token).then(
                    async () => {
                        this.$store.state.salad = new Salad(await auth.getAuth())
                        this.$router.push("/player")
                    }
                )
            }
        }
    }
</script>
<style>
    .login {
        position: relative;
        display: flex;
        flex-direction: column;
        padding-top: 180px;
        color: #000;
        /* background-color: red;
                                        -webkit-background-clip: text;
                                        -webkit-text-fill-color: transparent; */
    }
    .login-form {
        -webkit-app-region: no-drag;
        padding-left: 2.4em;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    .login-form-user,
    .login-form-pass {
        -webkit-appearance: none;
        border: none;
        font-size: 22px;
        border-bottom: 2px solid currentColor;
        min-width: 220px;
        width: 220px;
        outline: none;
        line-height: 180%;
        border-radius: 2px;
        text-indent: 0.2em;
        margin-bottom: 0.6em;
        font-family: "PTSans";
    }
    .login-form > input::placeholder {
        color: currentColor;
        opacity: 0.1;
    }
    .login-form-platforms {
        margin-top: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 30px;
    }
    .login-form-platforms > div {
        width: 25px;
        height: 25px;
        transition: all 0.5s;
        margin-right: 5px;
    }
    .login-form-go {
        margin-top: 1em;
        font-family: 思源黑体;
        font-weight: bold;
        height: 50px;
        display: flex;
        align-items: center;
        border: 2px solid #000;
        padding: 0 1em;
        cursor: pointer;
    }
    .login-form-go > div {
        width: 120px;
        display: inline-block;
        height: 20px;
        background-position: center center;
        background-size: contain;
        background-repeat: no-repeat;
        margin-left: 1em;
        transition: all 0.5s;
    }
    .login-smooth {
        position: absolute;
        line-height: 50px;
        top: 110px;
        left: 2.8em;
        font-size: 36px;
        font-family: "Rakkas";
    }
    .login-smooth > *:nth-child(1) {
        animation-delay: 0.5s;
    }
    .login-smooth > *:nth-child(2) {
        animation-delay: 1s;
    }
    .login-smooth > *:nth-child(3) {
        animation-delay: 1.5s;
    }
    .login-smooth > * {
        animation: fadeLetter 1s forwards;
        opacity: 0;
    }
    @keyframes fadeLetter {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>

