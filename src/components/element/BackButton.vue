<script setup>
    import { useRouter } from 'vue-router';
    
    const router = useRouter();

    const home = () => {
        router.push('/');
    }
</script>

<template>
    <div class="back-button-container">
        <button @click="home" class="home-button">Back to home!</button>
    </div>
</template>

<style scoped>

    .back-button-container {
        text-align: center;
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
        border-color:  rgb(253, 81, 1);
        color: #fff;
    }

</style>