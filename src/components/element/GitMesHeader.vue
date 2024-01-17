<!-- <script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const home = () => {
    router.push('/');
}
</script> -->

<template>
    <div class="header-container">
        <p class="header-text">Git Mes (GM)</p>
        <p class="header-mini-text">( Gitlab Commit Messages )</p>
    </div>
</template>

<style scoped>
.p {
    margin: 0;
    padding: 0;
}

.header-mini-text {
    text-align: center;
    color: rgb(248, 105, 38);
    font-size: 12px;
    color: #fff;
}

.header-text {
    padding-top: 20px;
    text-align: center;
    font-size: 40px;
    color: rgb(248, 105, 38);
    cursor: pointer;
}

.header-text:hover {
    color: rgb(253, 81, 1);
}

.header-container {
    position: fixed;
    width: 100%;
    height: 120px;
}
</style>