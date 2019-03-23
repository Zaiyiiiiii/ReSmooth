<template>
    <div>
        <canvas
            style="margin-top:100px;width:100%;"
            ref="canvas"
        ></canvas>
    </div>
</template>
<script>
    export default {
        mounted() {
            // setInterval(this.draw,100)
            this.draw()
        },
        methods:{
            draw(){
                if (this.$refs.canvas) {
                    this.$refs.canvas.width = 1300
                    this.$refs.canvas.height = 1300
                    this.context = this.$refs.canvas.getContext("2d")
                    let lineBaseLength = 10
                    this.context.lineCap = "round"
                    // this.context.globalAlpha = 0.9
                    // let lingrad = this.context.createLinearGradient(0, 0, 100, 100);
                    // lingrad.addColorStop(0.5, '#000');
                    // lingrad.addColorStop(1, 'rgba(0,0,0,0)');
                    this.context.lineWidth = 1
                    for (let x = 1300; x > 0; x -= 1) {
                        for (let number = Math.random() * 10 + 10; number > 0; number--) {
                            this.context.strokeStyle = "#000"
                            let length = lineBaseLength + Math.random() * 100
                            let y = Math.log(Math.random() * 1000) * 100 + 100
                            this.context.moveTo(x, y)
                            this.context.lineTo(x, y + length)
                        }
                    }
                    this.context.stroke()
                    this.context.beginPath()
                    for (let x = 1300; x > 0; x -= 1) {
                        for (let number = Math.random() * 10 + 10; number > 0; number--) {
                            this.context.strokeStyle = "#fff"
                            let length = lineBaseLength + Math.random() * 100
                            let y = 700 - Math.log(Math.random() * 1000) * 100
                            this.context.moveTo(x, y)
                            this.context.lineTo(x, y + length)
                        }
                    }
                    this.context.stroke()
                }
            }
        }
    }
</script>
