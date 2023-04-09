import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import IDescriptor from "~~/lib/interfaces/tools/IDescriptor";

export const useDescriptors = defineStore('descriptors', {
  state: () => ({
    descriptors: [] as IDescriptor[],
  }),
  actions: {
    async fetch() {
      if (this.descriptors.length > 0) return;
      this.descriptors = await api.auth_get("/descriptors");
    },
    async create(descriptor: IDescriptor) {
      this.descriptors.push(await api.auth_post("/descriptors", descriptor));
    }
  }
})