import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import ILink from "~~/lib/interfaces/ILink";
import Link from "~~/lib/wrappers/Link";
import { find, remove } from 'lodash'

export const useLinksList = defineStore('links', {
  state: () =>({
    links: [] as Link[],
  }),
  actions: {
    async fetch(synthesizer_id: string) {
      this.links = [];
      const results: ILink[] = await api.auth_get('/links', { synthesizer_id });
      this.links = results.map((ilink: ILink) => new Link(ilink));
    },
    async add(link: Link) {
      this.links.push(link);
    },
    async remove(id: string) {
      await api.auth_delete(`/links/${id}`);
      find(this.links, { id })?.disconnect();
      remove(this.links, { id })
    }
  }
})