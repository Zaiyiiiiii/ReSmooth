<template>
    <div
        class="paginia"
        ref="paginia"
    >
        <div
            class="paginia-line"
            :class="{'paginia-line-curr':(item == current)&&(total!=1),'paginia-line-off':Math.abs(item - current)>7}"
            v-for="item in total"
            :key="item"
            @click="current = item"
        >
            <div></div>
        </div>
    </div>
</template>
<style>
    .paginia {
        display: flex;
        align-items: flex-end;
        flex-grow: 1;
        height: 15px;
        max-width: 63px;
        margin-right: 20px;
        padding-right: 1.6px;
        overflow: hidden;
        -webkit-app-region: no-drag;
    }
    .paginia-line {
        width: 3.2px;
        /* margin-right: 1.6px; */
        height: 11px;
        flex-shrink: 0;
        transition: all 0.3s;
    }
    .paginia-line > div {
        background: #000;
        height: 100%;
        width: 0.1em;
        border-radius: 0.05em;
        transition: all 0.2s;
    }
    .paginia-line:hover {
        transform: translateY(-4px);
    }
    .paginia-line-curr {
        width: 6px;
        height: 11.3px;
    }
    .paginia-line-curr:hover {
        transform: none;
    }
    .paginia-line-curr > div {
        /* background: red; */
        width: 0.1em;
        transform: rotateZ(-13deg) translateX(1.5px) translateY(1px);
    }
    .paginia-line:first-child.paginia-line-curr {
        transform: rotateY(180deg) translateX(1.5px);
    }
    .paginia-line-off > div {
        background: #ccc;
    }
</style>
<script>
    import Velocity from 'velocity-animate'
    export default {
        watch: {
            current() {
                this.$emit('input', this.current)
                let offset = (this.current < 11) ? 0 : (this.current - 10) * 3.2
                // let offset = -32;
                console.log(offset)
                Velocity(this.$refs.paginia, { scrollLeft: `${offset}px` })
            },
            value() {
                console.log("c")
                this.current = this.value
            }
        },
        props: {
            total: { type: Number, default: 5 },
            value: { type: Number, default: 1 }
        },
        computed: {
            totalParts() {
                return Math.ceil(this.total / 20)
            }
        },
        data() {
            return {
                current: 1,
            }
        },
    }
</script>
