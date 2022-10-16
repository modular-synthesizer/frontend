import { defineStore } from "pinia";
import { api } from "../api/Api";
import { storage } from "./storage";

export const useLoginStore = defineStore("login", {
  state: () => ({
    token: ref(localStorage.getItem("auth-token") || ""),
    account: ref()
  }),
  getters: {
    loggedIn() {
      return this.token !== ""
    }
  },
  actions: {
    setToken(token: string) {
      storage().set("auth-token", token);
      this.token = token;
    },
    // This method checks the validity of the token when displaying a page.
    checkToken() {
      if (storage().has("auth-token")) {
        api.get(`/sessions/${this.token}`, {auth_token: this.token})
          .catch(_error => this.removeToken());
      }
    },
    syncAccount() {
      const s = storage();
      if (s.has("account")) {
        this.account = JSON.parse(s.get("account"));
        console.log(this.account);
      }
    },
    async removeToken() {
      storage().remove("auth-token");
      this.token = "";
      navigateTo('/');
    }
  }
});