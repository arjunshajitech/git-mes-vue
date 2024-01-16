<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import axios from 'axios';
    import { useApiStore } from '../store/pinia';

    const router = useRouter();

    const formValues = ref({
      secret: '',
      author: '',
      branch: '',
      projectId: '',
      since: '',
      until: ''
    });

    const gitCommits = async () => {
        try {
            const queryParam = `?author=${formValues.value.author}&ref_name=${formValues.value.branch}&since=${formValues.value.since}&until=${formValues.value.until}`
            let queryUrl = `https://gitlab.techgentsia.com/api/v4/projects/${formValues.value.projectId}/repository/commits` + queryParam;
            const response = await axios.get(queryUrl, {
                headers: {
                    'PRIVATE-TOKEN': `${formValues.value.secret}`,
                },
            });

            useApiStore().setApiResponseData(response.data);

        } catch (error) {
            useApiStore().setApiResponseData([]);
        }
        router.push('/commits')
    }
</script>

<template>
    <div class="form-container">
        <form class="input-form">
            <input v-model="formValues.secret" placeholder="Gitlab Shared Secret" class="input-data" type="text">
            <input v-model="formValues.author" placeholder="Author Name" class="input-data" type="text">
            <input v-model="formValues.branch" placeholder="Project Branch Name" class="input-data" type="text">
            <input v-model="formValues.projectId" placeholder="Project ID" class="input-data" type="text">
            <div class="date-container">
                <label class="date-label" for="">Since</label>
                <input v-model="formValues.since" class="input-data date-input" type="date">
            </div>
            <div class="date-container">
                <label class="date-label" for="">Until</label>
                <input v-model="formValues.until" class="input-data date-input" type="date">
            </div>
        </form>
        <button @click="gitCommits" class="form-submit-button">Get commit messages</button>
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
        width: 400px;
    }

    .input-data {
        margin-bottom: 10px;
        width: 100%;
        height: 40px;
        border-color:  rgb(248, 105, 38);
        padding-left: 15px;
        border-radius: 6px;
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
        border-color:  rgb(248, 105, 38);
        border-radius: 6px;
        cursor: pointer;
        color: grey;
    }

    .form-submit-button:hover {
        border-color:  rgb(253, 81, 1);
        color: #fff;
    }
</style>