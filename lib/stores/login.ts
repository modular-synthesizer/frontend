import { defineStore } from "pinia";

export const useLoginStore = defineStore("login", {
  state: () => {
    return {
      token: localStorage.getItem("auth-token")
    };
  },
  actions: {
    setToken(token: string) {
      localStorage.setItem("auth-token", token);
    }
  }
});