import { defineStore } from "pinia";
import { api } from "../api/Api";
import ICategory from "../interfaces/ICategory";
import { useAuthentication } from "./authentication";

export const useCategories = defineStore('categories', {
  state: () => ({
    categories: [] as ICategory[],
  }),
  actions: {
    fetchCategories() {
      const token: string = useAuthentication().session.token;
      api.get("/categories", {auth_token: token})
        .then(categories => this.categories = categories)
    }
  }
});