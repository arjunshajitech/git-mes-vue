import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export const success = (message) => {
    toast.success(message, {
        autoClose: 2000,
        theme: 'dark',
        position: 'bottom-right'
    });
}

export const failure = (message) => {
    toast.error(message, {
        autoClose: 2000,
        theme: 'dark',
        position: 'bottom-right'
    });
}

export const info = (message) => {
    toast.info(message, {
        autoClose: 2000,
        theme: 'dark',
        position: 'bottom-right'
    });
}

export const warning = (message) => {
    toast.warning(message, {
        autoClose: 2000,
        theme: 'dark',
        position: 'bottom-right'
    });
}

// export default { success, failure, warning, info };
