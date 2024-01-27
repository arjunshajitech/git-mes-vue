<script setup>
import GitMesHeader from '../element/GitMesHeader.vue';
import BackButton from '../element/BackButton.vue'
import ShowCommits from '../element/ShowCommits.vue';
import { ref , computed } from 'vue';

const authorName = ref('');

</script>

<template>
    <GitMesHeader :headerAuthorName="authorName" />
    <ShowCommits/>
    <BackButton/>
</template>