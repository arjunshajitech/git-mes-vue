<script setup>

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

toast.success("Successfully logged !", {
    autoClose: 2000,
    theme: 'dark',
    position: 'bottom-right'
});

</script>

<template>
    <div class="log-container">
        <p>Successfully logged!</p>
    </div>
</template>


<style scoped>
* {
    color: #fff;
}

.log-container {
    padding-top: 200px;
    text-align: center;
    font-size: 30px;
    margin-bottom: 20px;
}

</style>