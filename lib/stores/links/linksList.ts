import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import ILink from "~~/lib/interfaces/ILink";
import Link from "~~/lib/wrappers/Link";
import { useAuthentication } from "../authentication";
import { remove } from "lodash"

export const useLinksList = defineStore('linksList', {
  state: () => ({
    links: [] as Link[]
  }),
  actions: {
    fetchLinks() {
      const auth_token: string = useAuthentication().session.token;
      api.get("/links", { auth_token })
        .then(response => {
          response.forEach(link => this.addLink(link))
        })
    },
    addLink(link: ILink) {
      this.links.push(new Link(link));
    },
    removeLink(link: Link) {
      const auth_token: string = useAuthentication().session.token;
      link.disconnect()
      remove(this.links, {id: link.id});
      api.delete(`/links/${link.id}`, { auth_token })
    }
  }
})