import { defineStore } from "pinia";

export const storage = defineStore('storage', {
  actions: {
    get(key: string) {
      return (window !== undefined) ? localStorage.getItem(key) : ""
    },
    set(key: string, value: any) {
      return (window !== undefined) ? localStorage.setItem(key, value) : null;
    },
    has(key: string) {
      return (window !== undefined) && localStorage.getItem(key) !== null;
    },
    remove(key: string) {
      if(window !== undefined) {
        localStorage.removeItem(key)
      }
    }
  }
})