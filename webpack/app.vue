<template>
    <div>
        <div>Hello {{ name }}</div>
        <v-title title="Vue组件化"></v-title>
        <v-button @click="handleClick">点击按钮</v-button>
        <p class="img">
            <!--<img src="./images/image.png" style="width: 200px;">-->
        </p>
    </div>
</template>
<script>
    import vTitle from './title.vue';
    import vButton from './button.vue';

    export default {
        components: {
            vTitle,
            vButton
        },
        data () {
            return {
                name: 'Vue.js'
            }
        },
        methods: {
            handleClick (e) {
                console.log(e);
            }
        }
    }
</script>
<style scoped>
    div{
        color: #f60;
        font-size: 24px;
    }
    .img{
        width: 100px;
        height: 100px;
        background-image: url("./images/image.png");
        background-repeat: no-repeat;
        background-size: cover;
    }
</style>