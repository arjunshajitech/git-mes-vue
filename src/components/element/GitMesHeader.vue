<script setup>

import {ref,computed} from 'vue';
import constant from '../constants/constant'

const userName = ref('');

userName.value = localStorage.getItem(constant.TIGER) || '';

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
};

const getTodayWeekday = () => {
    const today = new Date();
    const options = { weekday: 'long' };
    return today.toLocaleDateString('en-US', options);
};

const today = new Date();
const todayDate = formatDate(today);
const weekDay = getTodayWeekday();

</script>

<template>
    <div class="header-container">
        <div class="gitmes-header">
            <!-- <div class="gitmes-icon">
                <img class="logo-icon" src="/favicon.png" alt="">
            </div> -->
            <div class="gitmes-text">
                <p class="header-text"><i>gitmes</i></p>
                <p class="header-mini-text"><i>Welcome back {{ text }} ! on <span>{{ weekDay }}</span></i></p>
            </div>

        </div>
    </div>
</template>

<style scoped>
.p {
    margin: 0;
    padding: 0;
}

span {
    color: rgb(253, 122, 61);
}

.header-mini-text {
    margin-left: 14px;
    color: rgb(248, 105, 38);
    font-size: 18px;
    color: #fff;
}

.gitmes-header {
    display: flex;
    justify-content: center;
    align-items: center;

}

.logo-icon {
    height: 40px;
    margin-top: -11px;
    margin-right: 10px;
    cursor: pointer;
}

.header-text {
    text-align: center;
    font-size: 40px;
    color: rgb(248, 105, 38);
    cursor: pointer;
}

.header-text:hover {
    color: rgb(253, 81, 1);
}

.header-container {
    margin-top: -15px;
    position: fixed;
    width: 100%;
    height: 100px;
    z-index: 100;
    padding-top: 40px;
}
</style>