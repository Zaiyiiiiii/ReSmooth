<style>
    .app-button {
        height: 50px;
        width: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        -webkit-app-region: no-drag;
    }
    .app-button * {
        transition: all 0.3s;
    }
</style>
<script>
    export default {
        props: {
            color: {
                type: String,
                default: "#000"
            },
            hoverColor: {
                type: String,
                default: "#fff"
            }
        },
        data() {
            return {
                hover: false
            }
        },
        computed: {
            currColor() {
                return this.hover ? this.hoverColor : this.color
            }
        },
        methods: {
            hoverIn() {
                this.hover = true
            },
            hoverOut() {
                this.hover = false
            }
        }
    }
</script>
