import { uniqBy } from "lodash";
import { defineStore } from "pinia";
import Link from "~~/lib/wrappers/Link";
import Mod from "~~/lib/wrappers/Mod";

export const useModulesLinks = defineStore('moduleLinks', {
  actions: {
    disconnect(mod: Mod) {
      const allLinks: Link[] = mod.ports.map(p => p.links).flat() as Link[];
      const uniqLinks: Link[] = uniqBy(allLinks, 'id');
      uniqLinks.forEach((link: Link) => useLinksList().remove(link.id));
    },
  }
});