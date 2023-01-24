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
      const ports = usePorts().ports;
      this.links = results
        .filter((ilink: ILink) => {
          return find(ports, {id: ilink.from}) !== undefined
              && find(ports, {id: ilink.to}) !== undefined
        })
        .map((ilink: ILink) => new Link(ilink));
    },
    async add(link: Link) {
      this.links.push(link);
    },
    delete(id: string) {
      find(this.links, { id })?.disconnect();
      remove(this.links, { id })
    },
    async remove(id: string) {
      // await api.auth_delete(`/links/${id}`);
      this.delete(id);
    }
  }
})