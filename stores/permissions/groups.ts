import { remove } from "lodash";
import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import IGroup from "~~/lib/interfaces/permissions/IGroup";
import IRight from "~~/lib/interfaces/permissions/IRight";

/**
 * This store holds the logic to fetch a list of groups, add, edit and delete new ones.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export const useGroups = defineStore('groups', {
  state: () => ({
    groups: [] as IGroup[]
  }),
  actions: {
    async init() {
      this.groups = await api.auth_get('/groups');
    },
    async add(slug: string, rights: IRight[]) {
      this.groups.push(await api.auth_post('/groups', { slug, rights, }))
    },
    async remove(group: IGroup) {
      await api.auth_delete(`/groups/${group.id}`);
      remove(this.groups, group);
    }
  }
})