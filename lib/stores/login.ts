import { defineStore } from "pinia";

export const useLoginStore = defineStore("login", {
  state: () => {
    return {
      token: localStorage.getItem("auth-token") || ""
    };
  },
  getters: {
    loggedIn() {
      return this.token !== ""
    }
  },
  actions: {
    setToken(token: string) {
      localStorage.setItem("auth-token", token);
      this.token = token;
    },
    async removeToken() {
      localStorage.removeItem("auth-token");
      this.token = ""
    }
  }
});