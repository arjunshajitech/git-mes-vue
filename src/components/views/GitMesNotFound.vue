<script setup>
    import GitMesHeader from '../element/GitMesHeader.vue';
    import NotFound from '../element/NotFound.vue';
    import { useRouter } from 'vue-router';
    
    const router = useRouter();

    const home = () => {
        router.push('/');
    }
</script>

<template>
    <GitMesHeader/>
    <NotFound/>
    <div class="back-button-container">
        <button @click="home" class="home-button">Back to home!</button>
    </div>
</template>

<style scoped> 

.back-button-container {
        text-align: center;
        position: absolute;
        width: 100%;
        margin-top: 300px;
    }
    
    .home-button {
        margin-top: 20px;
        width: 200px;
        height: 40px;
        border-color:  rgb(248, 105, 38);
        border-radius: 6px;
        cursor: pointer;
        color: grey;
        margin-bottom: 20px;
    }

    .home-button:hover {
        border-color:  #fff;
        color: #fff;
        transition: 0.5s;
    }

</style>