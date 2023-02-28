import { remove } from "lodash";
import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import IRight from "~~/lib/interfaces/permissions/IRight";

/**
 * This store holds the logic to fetch a list of rights, add, edit and delete new ones.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export const useRights = defineStore('rights', {
  state: () => ({
    rights: [] as IRight[]
  }),
  actions: {
    async init() {
      this.rights = await api.auth_get('/rights');
    },
    async add(label: string) {
      this.rights.push(await api.auth_post('/rights', { label }))
    },
    async remove(right: IRight) {
      console.log(right);
      await api.auth_delete(`/rights/${right.id}`);
      remove(this.rights, right);
    }
  }
})