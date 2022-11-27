import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import ILink from "~~/lib/interfaces/ILink";
import Link from "~~/lib/wrappers/Link";
import { useAuthentication } from "../authentication";
import { find, remove } from "lodash"
import { useSynthesizerDetails } from "../synthesizers/details";

export const useLinksList = defineStore('linksList', {
  state: () => ({
    links: [] as Link[]
  }),
  actions: {
    async fetchLinks() {
      const auth_token: string = useAuthentication().session.token;
      const synthesizer_id = useSynthesizerDetails().synthesizer.id;
      const response = await api.get("/links", { auth_token, synthesizer_id });
      response.forEach(link => this.addLink(link));
    },
    addLink(link: ILink) {
      this.links.push(new Link(link));
    },
    removeLink(link: Link) {
      const auth_token: string = useAuthentication().session.token;
      link.disconnect()
      remove(this.links, {id: link.id});
      api.delete(`/links/${link.id}`, { auth_token })
    },
    removeLinkById(linkId: string) {
      const link = find(this.links, {id: linkId});
      if (link !== undefined) {
        this.removeLink(link);
      }
    },
    resetLinks() {
      this.links = []
    }
  }
})