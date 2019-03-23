<script>
    export default {
        computed: {
            isPlaying() {
                return true
            },
            currentPlayMainColor() {
                return false
            },
            //如果有正在播放的歌曲同时封面颜色开启则返回playing.playingTheme
            //直接生成六色方案，或生成一色，通过一色计算出四色方案。
            playingTheme() {
                return this.$store.state.playing.playingTheme
            },
            mainColor() {
                if (this.isPlaying && this.playingTheme) {
                    let colorKey = Object.keys(this.playingTheme).filter(key=>this.playingTheme[key]&&this.playingTheme[key]._hsl)
                    let color = this.playingTheme[colorKey[colorKey.length - 1]]._hsl
                    console.log(this.playingTheme)
                    return "hsl(" + color[0]*360 + "," + color[1]*100 + "%," + color[2]*100 + "%)"
                }
                return this.$store.state.theme.mainColor
            },
            textColor(){
                if (this.isPlaying && this.playingTheme) {
                    return this.mainColor.split	(",")[2].split(".")[0] > 75 ? '#000' : "#fff"
                 }
                return "#fff"
            },
            reTextColor(){
                if (this.isPlaying && this.playingTheme) {
                    return this.mainColor.split	(",")[2].split(".")[0] > 75 ? '#fff' : "#000"
                 }
                return "#000"                
            },
            defaultColor(){
                return "rgba(200,200,200,0.3)"
            }
        }
    }
</script>
