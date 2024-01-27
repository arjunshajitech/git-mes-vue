<script setup>
import GitMesHeader from '../element/GitMesHeader.vue';
import GitMesForm from '../element/GitMesForm.vue'

import { ref } from 'vue';
const headerText = ref('');

const setHeaderText = (val) => {
    headerText.value = val;
}

</script>

<template>
    <GitMesHeader :headerAuthorName="headerText" />
    <GitMesForm @header-text="setHeaderText" />
</template>