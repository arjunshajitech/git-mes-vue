<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useApiStore } from '../store/pinia';
import Loading from './Loading.vue';

const router = useRouter();

const authorError = ref(false);
const projectIdError = ref(false);
const completeFormError = ref(false);
const loading = ref(false);
const displayLoggingDate = ref(false);

const formValues = ref({
    secret: '',
    tlUsername: '',
    tlPassword: '',
    author: '',
    branch: '',
    projectId: '',
    since: '',
    until: '',
    logDate: '',
    checked: false
});

formValues.value.author = localStorage.getItem('gitLabAuthor') || '';
formValues.value.branch = localStorage.getItem('gitLabBranch') || '';
formValues.value.projectId = localStorage.getItem('gitLabProjectId') || '';
formValues.value.tlUsername = localStorage.getItem('tlUsername') || '';
formValues.value.tlPassword = localStorage.getItem('tlPassword') || '';


function watchAndValidate(valueGetter, validationFn, errorRef) {
    watch(() => valueGetter(), () => {
        errorRef.value = !validationFn(valueGetter());
    });
}

watchAndValidate(() => formValues.value.author, isAlphaString, authorError);
watchAndValidate(() => formValues.value.projectId, isNumericString, projectIdError);

function isAnyValueEmpty(formData) {
    for (const key in formData.value) {
        if (formData.value[key] === '' || formData.value[key] === undefined) {
            return true;
        }
    }
    return false;
}

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const today = new Date();
formValues.value.since = formatDate(today);
formValues.value.logDate = formatDate(today);

function isAlphaString(str) {
    return /^[a-zA-Z\s]+$/.test(str);
}

function isNumericString(str) {
    return /^[0-9]+$/.test(str);
}

const savetoLocalStorage = (key, value) => {
    localStorage.setItem(key, value);
}

const generateNextDayDate = (date) => {
    const currentDate = new Date(date);
    const nextDay = new Date(date);
    nextDay.setDate(currentDate.getDate() + 1);
    return nextDay.toISOString().split('T')[0];
}

const handleCheckboxChange = () => {
    if (displayLoggingDate.value === false) {
        displayLoggingDate.value = true;
        formValues.value.checked = true;
    } else {
        displayLoggingDate.value = false;
        formValues.value.checked = false;
    }
}

const gitCommits = async () => {

    formValues.value.until = generateNextDayDate(formValues.value.since)

    // if (isAnyValueEmpty(formValues)) {
    //     completeFormError.value = true
    // } else {
    savetoLocalStorage('gitLabAuthor', formValues.value.author);
    savetoLocalStorage('gitLabBranch', formValues.value.branch);
    savetoLocalStorage('gitLabProjectId', formValues.value.projectId);
    savetoLocalStorage('tlUsername', formValues.value.tlUsername);
    savetoLocalStorage('tlPassword', formValues.value.tlPassword);
    loading.value = true;
    try {
        const queryParam = `?author=${formValues.value.author}&ref_name=${formValues.value.branch}&since=${formValues.value.since}&until=${formValues.value.until}`
        let queryUrl = `https://gitlab.techgentsia.com/api/v4/projects/${formValues.value.projectId}/repository/commits` + queryParam;
        const response = await axios.get(queryUrl, {
            headers: {
                'PRIVATE-TOKEN': `${formValues.value.secret}`,
            },
        });

        useApiStore().setApiResponseData(response.data);
        loading.value = false;
    } catch (error) {
        useApiStore().setApiResponseData([]);
    }
    router.push('/commits')
    //}
}

</script>

<template>
    <div class="form-container">
        <form class="input-form">
            <div v-if="completeFormError">
                <p class="input-error-text-complete">Please fill the complete fields !</p>
            </div>
            <p v-if="projectIdError" class="input-error-text">Please provide a valid projectId !</p>
            <p v-if="authorError" class="input-error-text">Please provide a valid author name !</p>
            <div class="input-field-container">
                <input v-model="formValues.tlUsername" placeholder="TimeLogging username" class="input-data" type="text">
                <input v-model="formValues.tlPassword" placeholder="TimeLoggin password" class="input-data" type="text">
            </div>
            <div class="input-field-container">
                <input v-model="formValues.secret" placeholder="Gitlab Shared Secret" class="input-data" type="text">
                <input v-model="formValues.branch" placeholder="Project Branch Name" class="input-data" type="text">
            </div>
            <div class="input-field-container">
                <input v-model="formValues.author" placeholder="Author Name" class="input-data" type="text">
                <input v-model="formValues.projectId" placeholder="Project ID" class="input-data" type="text">
            </div>
            <div class="date-container">
                <label class="date-label" for="">Gitlab Commit Date</label>
                <input v-model="formValues.since" class="input-data date-input" type="date">
            </div>
            <div class="checkbox-container">
                <input @change="handleCheckboxChange" type="checkbox" id="myCheckbox" name="myCheckbox">
                <p>( Please check the box if you want to log. )</p>
            </div>
            <div v-if="displayLoggingDate" class="date-container">
                <label class="date-label" for="">Logging Date</label>
                <input v-model="formValues.logDate" class="input-data date-input" type="date">
            </div>
        </form>
        <button @click="gitCommits" class="form-submit-button">Get commit messages</button>
    </div>
    <div v-if="loading">
        <Loading />
    </div>
</template>

<style scoped>
* {
    color: #fff;
}

label {
    padding: 0;
    margin: 0;
}

.date-container {
    position: relative;
}

::-webkit-calendar-picker-indicator {
    cursor: pointer;
    background-image: url(http://icons.iconarchive.com/icons/dakirby309/simply-styled/256/Calendar-icon.png);
}

.input-error-text {
    font-size: 13px;
    margin-bottom: 10px;
    color: rgb(255, 187, 0);
}

.input-error-text-complete {
    font-size: 13px;
    margin-bottom: 10px;
    color: rgb(255, 187, 0);
    text-align: center;
}

.checkbox-container {
    display: flex;
    column-gap: 10px;
    align-items: center;
    width: 400px;
    justify-content: left;
    font-size: 13px;
    margin-left: 5px;
    margin-bottom: 15px;
}

.date-label {
    position: absolute;
    top: -7px;
    left: 35px;
    font-size: 11px;
    padding-left: 3px;
    padding-right: 3px;
    color: gray;
}

.date-label:hover {
    color: rgb(248, 105, 38);
}

.button {
    padding: 0;
    margin: 0;
}

.form-container {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    row-gap: 20px;
}

.form-text {
    font-size: 20px;
}

.input-form {
    margin-top: 130px;
    width: 400px;
}

.input-field-container {
    width: 425px;
    display: flex;
    column-gap: 10px;
    justify-content: center;
    align-items: center;
}

.input-data {
    margin-bottom: 10px;
    width: 100%;
    height: 40px;
    border-color: rgb(248, 105, 38);
    padding-left: 15px;
    border-radius: 6px;
    padding-right: 10px;
}

.input-data:hover {
    border-color: rgb(253, 81, 1);
}

.input-data:focus {
    outline: none;
}

.form-submit-button {
    width: 300px;
    height: 40px;
    border-color: rgb(248, 105, 38);
    border-radius: 6px;
    cursor: pointer;
    color: grey;
}

.form-submit-button:hover {
    border-color: #fff;
    color: #fff;
}
</style>