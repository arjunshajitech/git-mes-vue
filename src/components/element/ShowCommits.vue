<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Clipboard from 'clipboard'
import { useApiStore } from '../store/pinia';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const router = useRouter();

const apiResponse = computed(() => useApiStore().getApiResponseData());
const groupedResponse = ref([]);
const copyValue = ref('Copy commit');
const emptyCommit = ref(false);
let length = 0;

const calculateSize = (length) => Math.ceil(length / 3);

// if (apiResponse.value == null || apiResponse.value.length === 0) {
//     emptyCommit.value = true;
//     toast.warning("no commits yet !", {
//         autoClose: 2000,
//         theme: 'dark',
//         position: 'bottom-right'
//     });
// } else {
//     toast.info("commits !", {
//         autoClose: 2000,
//         theme: 'dark',
//         position: 'bottom-right'
//     });
// }

length = apiResponse.value.length;
const size = calculateSize(length);
for (let index = 0; index < length; index += size) {
    groupedResponse.value.push(apiResponse.value.slice(index, index + size));
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

const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    const day = dateObject.getDate().toString().padStart(2, '0');
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObject.getFullYear();
    return `${day}-${month}-${year}`;
}



</script>


<template>
    <div class="table-container">
        <div v-if="!emptyCommit" class="card-header-text">
            <p class="table-text">Commit Messages ...</p>
            <div class="commit-message-container">

                <div v-for="(group, groupIndex) in groupedResponse" :id="groupIndex" :key="groupIndex"
                    ref="copyTextContainer" class="commit-message">

                    <div v-for="(response, responseIndex) in group" :key="responseIndex" class="message-container">
                        <p class="message">{{ response.message
                        }}</p>
                        <h6 class="commit-date">{{ formatDate(response.committed_date) }} &#8594;</h6>
                    </div>

                    <button @click="copyText(groupIndex)" :id="'button-' + groupIndex" class="copy-button">
                        {{ copyValue }}</button>
                </div>

            </div>
        </div>
        <div v-else>
            <p class="empty-commit-text"><i>Oops! No commit Messages found.</i></p>
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

.message-container {
    position: relative;
}

.commit-date {
    position: absolute;
    top: 4px;
    left: 15px;
    font-family: OutFit;
    font-size: 9px;
    color: rgba(0, 255, 140, 0.708);
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

.table-text,
.empty-commit-text {
    text-align: center;
    margin-top: 120px;
}

.commit-message {
    position: relative;
    margin-bottom: 10px;
    width: 500px;
    border: 2px solid rgb(248, 105, 38);
    border-radius: 4px;
}


.message {
    padding: 2px 90px;
    font-size: 12px;
    max-width: 400px;
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