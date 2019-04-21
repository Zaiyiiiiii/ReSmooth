<template>
    <div class="search">
        <div
            v-for="item in searchResult"
            :key="item.id"
            @click="$store.dispatch('playing/insertSong',item)"
        >
            {{item.name}}
        </div>
    </div>
</template>
<style>
    .search {
        -webkit-app-region: no-drag;
        text-align: right;
        overflow-y: auto;
    }
</style>
<script>
    export default {
        beforeMount() {
            if (this.$route.query.t) {
                this.getSearchResult(this.$route.query.t)
            }
        },
        data() {
            return {
                searchResult: []
            }
        },
        computed:{
            query(){
                return this.$route.query.t
            }
        },
        watch:{
            query(){
                this.getSearchResult(this.query)
            }
        },
        methods: {
            async getSearchResult(t) {
                this.searchResult = await this.$store.state.salad.search(t)
            }
        }
    }
</script>

