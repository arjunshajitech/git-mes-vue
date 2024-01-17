<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Clipboard from 'clipboard'
import { useApiStore } from '../store/pinia';

const router = useRouter();
const copyValue = ref('Copy commit');
const emptyCommitMessage = ref(false);
const apiResponse = computed(() => useApiStore().getApiResponseData());
const groupedResponse = [];

if (apiResponse.value.length <= 0) {
    emptyCommitMessage.value = true;
}

let length = apiResponse.value.length;
let chunkSize;

if (length < 9) {
    chunkSize = 2;
} else if (length < 15) {
    chunkSize = 3;
} else {
    chunkSize = 5;
}
for (let index = 0; index < length; index += chunkSize) {
    groupedResponse.push(apiResponse.value.slice(index, index + chunkSize));
}


const copyText = (index) => {

    const buttonElement = document.getElementById('button-' + index);
    buttonElement.innerHTML = 'Copied!';
    buttonElement.style.color = 'white';

    setTimeout(() => {
        buttonElement.innerHTML = 'Copy commit';
        buttonElement.style.color = 'grey';
    }, 2000);

    const textContainer = document.getElementById(index);
    const paragraphs = textContainer.querySelectorAll('p');
    const textToCopy = Array.from(paragraphs).map(p => p.textContent).join('\n');
    const clipboard = new Clipboard('button', {
        text: () => textToCopy
    });
    clipboard.onClick({ currentTarget: document.querySelector('button') });

}

const home = () => {
    router.push('/');
}
</script>

<template>
    <div class="table-container">
        <div v-if="!emptyCommitMessage" class="card-header-text">
            <p class="table-text">Commit Messages ...</p>
            <div class="commit-message-container">

                <div v-for="(group, groupIndex) in groupedResponse" :id="groupIndex" :key="groupIndex"
                    ref="copyTextContainer" class="commit-message">
                    <p v-for="(response, responseIndex) in group" :key="responseIndex" class="message">{{ response.message
                    }}</p>
                    <button @click="copyText(groupIndex)" :id="'button-' + groupIndex" class="copy-button">
                        {{ copyValue }}</button>
                </div>

            </div>
        </div>
        <div v-else>
            <p class="table-text">No commit Messages found !</p>
        </div>
    </div>
</template>

<style scoped>
* {
    color: #fff;
}

p {
    margin: 0;
    padding: 0;
}

.card-header-text {
    margin-top: 120px;
}

.table-container {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.commit-message-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    width: 500px;
}

.table-text {
    text-align: center;
}

.commit-message {
    position: relative;
    margin-bottom: 10px;
    width: 500px;
    border: 2px solid rgb(248, 105, 38);
    border-radius: 4px;
}


.message {
    padding: 2px 30px;
    font-size: 12px;
    max-width: 350px;
}

.copy-button {
    position: absolute;
    right: 5px;
    top: 1px;
    border: none;
    cursor: pointer;
    font-size: 12px;
    color: grey;
}

.copy-button:hover {
    transition: .5s;
    background-color: rgb(29, 28, 28);
    color: #fff;
}
</style>