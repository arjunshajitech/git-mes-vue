import { defineStore } from 'pinia';

export const useApiStore = defineStore('api', {
  state: () => ({
    apiResponseData: null,
  }),
  actions: {
    setApiResponseData(data) {
      this.apiResponseData = data;
    },
    getApiResponseData() {
      return this.apiResponseData;
    },
  },
});
