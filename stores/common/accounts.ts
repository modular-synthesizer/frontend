import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";

export const useAccounts = defineStore('accounts', {
  state() {
    return {
      account: { username: '', email: '' }
    }
  },
  actions: {
    async fetchOwn() {
      this.account = await api.auth_get('/accounts/own');
    }
  }
});