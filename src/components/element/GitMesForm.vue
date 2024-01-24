<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useApiStore } from '../store/pinia';
import Loading from './Loading.vue';
import { getValueWithExpiry, setValueWithExpiry } from '../functions/utils'

import { success, failure, info, warning } from '../functions/toast';
import constant from '../constants/constant'

//  localStorage.clear();


const router = useRouter();

const authorError = ref(false);
const projectIdError = ref(false);
const loading = ref(false);
const displayLoggingDate = ref(false);
const timeLogDetails = ref(true);
const progresBarWidth = ref(0);
const projects = ref([]);
const groupedResponse = ref([]);
let length = 0;


projects.value = getValueWithExpiry(constant.LOCAL_STORAGE_PROJECT_LIST_KEY);
if (projects.value != null) {
    if (projects.value.length != 0) {
        progresBarWidth.value = 100;
        timeLogDetails.value = false;
    } else {
        progresBarWidth.value = 0;
        timeLogDetails.value = true;
    }
}


const calculateSize = (length) => Math.ceil(length / 3);

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
    project: '',
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

const generateNextDayDate = async (date) => {
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

const generateGetAllCommitsUrl = () => {
    const queryParam = `?author=${formValues.value.author}&ref_name=${formValues.value.branch}&since=${formValues.value.since}&until=${formValues.value.until}`
    return `https://gitlab.techgentsia.com/api/v4/projects/${formValues.value.projectId}/repository/commits` + queryParam;
}

function generateFormattedDate(baseDate, hours, minutes) {
    const baseDateTime = new Date(baseDate);
    const resultDate = new Date(baseDateTime);
    resultDate.setHours(hours, minutes, 0, 0);
    const indiaOffsetMinutes = 330; // 5 hours and 30 minutes
    resultDate.setMinutes(resultDate.getMinutes() + indiaOffsetMinutes);

    return resultDate.toISOString().split('.')[0];
}

function generateDateInIndia(baseDate, hours, minutes) {
    return generateFormattedDate(baseDate, hours, minutes);
}

/* time log form submit */
const timelogSubmit = () => {

    if (formValues.value.tlUsername === '' ||
        formValues.value.tlPassword === '') {
        warning(constant.TL_FORM_INCOMPLETE)
    } else {
        loading.value = true;
        const headers = {
            'X-AUTH-USER': formValues.value.tlUsername,
            'X-AUTH-TOKEN': formValues.value.tlPassword
        };
        
        axios.get(constant.TL_GET_ALL_PROJECTS_URL, { headers })
            .then(response => {
                timeLogDetails.value = false;
                progresBarWidth.value = 100;
                loading.value = false;
                projects.value = response.data;
                setValueWithExpiry(constant.LOCAL_STORAGE_PROJECT_LIST_KEY, response.data, constant.PROJECT_LIST_EXPIRY_TIME);
                success(constant.TL_FORM_LOGIN_SUCCESS);
            })
            .catch(error => {
                loading.value = false;
                failure(constant.TL_FORM_LOGIN_FAILURE);
            });
    }
}

/* main form submittion */
const submitMainForm = async () => {

    if (formValues.value.secret === '' || formValues.value.author === '' || formValues.value.branch == '' ||
        formValues.value.projectId == '' || formValues.value.since == '') {
        warning(constant.MAIN_FORM_INCOMPLETE);
    } else {
        formValues.value.until = await generateNextDayDate(formValues.value.since)
        savetoLocalStorage('gitLabAuthor', formValues.value.author);
        savetoLocalStorage('gitLabBranch', formValues.value.branch);
        savetoLocalStorage('gitLabProjectId', formValues.value.projectId);
        savetoLocalStorage('tlUsername', formValues.value.tlUsername);
        savetoLocalStorage('tlPassword', formValues.value.tlPassword);

        if (formValues.value.checked === false) {
            loading.value = true;

            const queryUrl = generateGetAllCommitsUrl();
            const headers = {
                'PRIVATE-TOKEN': formValues.value.secret
            };

            await axios.get(queryUrl, { headers })
                .then(response => {
                    useApiStore().setApiResponseData(response.data);
                })
                .catch(error => {
                    useApiStore().setApiResponseData([]);
                });

            loading.value = false;
            router.push('/commits')
        } else {
            loading.value = true;
            if (formValues.value.logDate === '' || formValues.value.project == '') {
                warning(constant.MAIN_FORM_INCOMPLETE);
            } else {
                const queryUrl = generateGetAllCommitsUrl();
                const headers = {
                    'PRIVATE-TOKEN': formValues.value.secret
                };

                console.log(queryUrl);
                await axios.get(queryUrl, { headers })
                    .then(response => {
                        //console.log(response.data);

                        length = response.data.length;

                        if (length === 0) {
                            warning(constant.NO_COMMITS_FOUND);
                        }

                        const size = calculateSize(length);
                        for (let index = 0; index < length; index += size) {
                            groupedResponse.value.push(response.data.slice(index, index + size));
                        }

                        const baseDate = formValues.value.logDate;
                        const date915AM = generateDateInIndia(baseDate, 9, 15);
                        const date1PM = generateDateInIndia(baseDate, 13, 0);
                        const date130PM = generateDateInIndia(baseDate, 13, 30);
                        const date4PM = generateDateInIndia(baseDate, 16, 0);
                        const date630PM = generateDateInIndia(baseDate, 18, 30);

                        let resultString1 = '';
                        let resultString2 = '';
                        let resultString3 = '';
                        let groupedResponseLength = groupedResponse.value.length;

                        const headers = {
                            'X-AUTH-USER': formValues.value.tlUsername,
                            'X-AUTH-TOKEN': formValues.value.tlPassword
                        };

                        let apiUrl = "https://tl.techgentsia.com/api/timesheets";

                        if (groupedResponseLength === 3) {

                            for (let i = 0; i < groupedResponseLength; i++) {
                                const innerArray = groupedResponse.value[i];
                                const resultString = innerArray.map(obj => obj.title).join('\n');
                                if (i === 0) {
                                    resultString1 = resultString;
                                } else if (i === 1) {
                                    resultString2 = resultString;
                                } else if (i === 2) {
                                    resultString3 = resultString;
                                }
                            }

                            let body1 = {
                                'begin': date915AM,
                                'end': date1PM,
                                'project': formValues.value.project,
                                'activity': 2,
                                'description': resultString1,
                                'tags': ''
                            }

                            let body2 = {
                                'begin': date130PM,
                                'end': date4PM,
                                'project': formValues.value.project,
                                'activity': 2,
                                'description': resultString2,
                                'tags': ''
                            }

                            let body3 = {
                                'begin': date4PM,
                                'end': date630PM,
                                'project': formValues.value.project,
                                'activity': 2,
                                'description': resultString3,
                                'tags': ''
                            }

                            axios.post(apiUrl, body1, { headers });
                            axios.post(apiUrl, body2, { headers });
                            axios.post(apiUrl, body3, { headers });

                            router.push('/log')
                            loading.value = false;
                        } else if (groupedResponseLength === 2) {

                            for (let i = 0; i < groupedResponseLength; i++) {
                                const innerArray = groupedResponse.value[i];
                                const resultString = innerArray.map(obj => obj.title).join('\n');
                                if (i === 0) {
                                    resultString1 = resultString;
                                } else if (i === 1) {
                                    resultString2 = resultString;
                                }
                            }

                            let body1 = {
                                'begin': date915AM,
                                'end': date1PM,
                                'project': formValues.value.project,
                                'activity': 2,
                                'description': resultString1,
                                'tags': ''
                            }

                            let body2 = {
                                'begin': date130PM,
                                'end': date4PM,
                                'project': formValues.value.project,
                                'activity': 2,
                                'description': resultString2,
                                'tags': ''
                            }

                            let body3 = {
                                'begin': date4PM,
                                'end': date630PM,
                                'project': formValues.value.project,
                                'activity': 2,
                                'description': resultString2,
                                'tags': ''
                            }

                            axios.post(apiUrl, body1, { headers });
                            axios.post(apiUrl, body2, { headers });
                            axios.post(apiUrl, body3, { headers });

                            router.push('/log')
                            loading.value = false;
                        } else if (groupedResponseLength === 1) {
                            for (let i = 0; i < groupedResponseLength; i++) {
                                const innerArray = groupedResponse.value[i];
                                const resultString = innerArray.map(obj => obj.title).join('\n');
                                if (i === 0) {
                                    resultString1 = resultString;
                                }
                            }

                            let body1 = {
                                'begin': date915AM,
                                'end': date1PM,
                                'project': formValues.value.project,
                                'activity': 2,
                                'description': resultString1,
                                'tags': ''
                            }

                            let body2 = {
                                'begin': date130PM,
                                'end': date4PM,
                                'project': formValues.value.project,
                                'activity': 2,
                                'description': resultString1,
                                'tags': ''
                            }

                            let body3 = {
                                'begin': date4PM,
                                'end': date630PM,
                                'project': formValues.value.project,
                                'activity': 2,
                                'description': resultString1,
                                'tags': ''
                            }

                            axios.post(apiUrl, body1, { headers });
                            axios.post(apiUrl, body2, { headers });
                            axios.post(apiUrl, body3, { headers });

                            router.push('/log')
                            loading.value = false;
                        } else {
                            error(constant.SOMTHING_WENT_WRONG);
                        }


                    })
                    .catch(error => {
                        error(constant.SOMTHING_WENT_WRONG);
                    });
            }

            loading.value = false;
        }
    }

}

</script>

<template>
    <div class="form-container">


        <div class="progress-bar">
            <div class="progress">
                <div :style="{ width: progresBarWidth + '%' }" class="progress-data"></div>
            </div>
            <div class="progress-bar-left-text">timelog login</div>
            <div class="progress-bar-right-text">gitlab details</div>
        </div>

        <div v-if="timeLogDetails" class="time-logging-contaier">
            <input v-model="formValues.tlUsername" placeholder="TimeLogging username" class="input-data" type="text">
            <input v-model="formValues.tlPassword" placeholder="TimeLoggin password" class="input-data" type="password">
            <button @click="timelogSubmit" class="timelog-submit-button">Login</button>
        </div>

        <div v-else class="input-form">

            <p v-if="projectIdError" class="input-error-text">Please provide a valid projectId !</p>
            <p v-if="authorError" class="input-error-text">Please provide a valid author name !</p>


            <div class="input-field-container">
                <input v-model="formValues.secret" placeholder="Gitlab Shared Secret" class="input-data" type="password">
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

                <div class="select-project-container">
                    <label class="select-text" for="mySelect">Choose project :</label>
                    <select v-model="formValues.project" class="select-button" id="mySelect" name="mySelect">
                        <option value="">Select</option>
                        <option v-for="project in projects" :value="project.id">{{ project.name }}</option>
                    </select>
                </div>
            </div>
            <div class="form-submit-container">
                <button @click="submitMainForm" class="form-submit-button">Submit</button>
            </div>
        </div>

    </div>
    <div v-if="loading">
        <Loading />
    </div>
</template>

<style scoped>
* {
    color: #fff;
}

.select-project-container {
    display: flex;
    margin-bottom: 20px;
    justify-content: space-between;
    margin-left: 25px;
    align-items: center;
}

.select-button {
    padding: 2px;
    border-radius: 4px;
    width: 150px;
    cursor: pointer;
    border: 2px solid rgb(248, 105, 38);
}

.select-text {
    font-size: 13px;
}

.progress-bar {
    margin-top: 130px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.time-logging-contaier {
    margin-top: 40px;
    width: 400px;
    text-align: center;
}

.progress {
    width: 400px;
    margin-left: 19px;
    height: 6px;
    border-radius: 1px;
    border: 1px solid #fff;
}

.progress-data {
    background-color: rgb(248, 105, 38);
    transition: 1.5s;
    height: 6px;
}

.progress-bar-left-text {
    margin-left: 19px;
    font-size: 10px;
    left: 0;
    top: 15px;
    position: absolute;
}

.progress-bar-right-text {
    font-size: 10px;
    right: 0;
    top: 15px;
    position: absolute;
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

.form-submit-container {
    width: 400px;
    text-align: center;
}

.form-text {
    font-size: 20px;
}

.input-form {
    margin-top: 40px;
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

.form-submit-button,
.timelog-submit-button {
    width: 200px;
    height: 40px;
    border-color: rgb(248, 105, 38);
    border-radius: 6px;
    cursor: pointer;
    color: grey;
}

.form-submit-button:hover,
.timelog-submit-button:hover {
    border-color: #fff;
    color: #fff;
}
</style>../services/toast../functions/toast