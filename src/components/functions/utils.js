import constant from "../constants/constant";

const getValueWithExpiry = (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
        return null; // Item does not exist
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key); // Remove expired item
        return null;
    }

    return item.value;
}

const setValueWithExpiry = (key, value, expiryInSeconds) => {
    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + constant.PROJECT_LIST_EXPIRY_TIME * 24 * 60 * 60 * 1000
    };
    localStorage.setItem(key, JSON.stringify(item));
};


const saveToLocalStorage = (key,value) => {
    localStorage.setItem(key,value);
}


export { getValueWithExpiry , setValueWithExpiry , saveToLocalStorage };