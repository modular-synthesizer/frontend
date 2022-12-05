import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import ILink from "~~/lib/interfaces/ILink";
import Link from "~~/lib/wrappers/Link";

export const useConnectionsList = defineStore('connections', {
  state: () =>({
    links: [] as Link[],
  }),
  actions: {
    async fetch(synthesizer_id: string) {
      this.links = [];
      const results: ILink[] = await api.auth_get('/links', { synthesizer_id });
      this.links = results.map((ilink: ILink) => new Link(ilink));
    }
  }
})