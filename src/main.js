import './assets/main.css'
import router from './components/routes'
import { createApp } from 'vue'
import App from './App.vue'
import Vue3Toastify  from 'vue3-toastify';
import { createPinia } from 'pinia'

const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(Vue3Toastify);

app.mount('#app');
