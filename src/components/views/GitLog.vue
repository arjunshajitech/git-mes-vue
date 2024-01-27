<script setup>
import GitMesHeader from '../element/GitMesHeader.vue';
import LogSuccess from '../element/LogSuccess.vue';
import BackButton from '../element/BackButton.vue';
import { ref } from 'vue';
const headerText = ref('');
</script>

<template>
    <GitMesHeader :headerAuthorName="headerText" />
    <LogSuccess/>
    <BackButton/>
</template>