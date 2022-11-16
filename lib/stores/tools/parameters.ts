import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import Parameter from "~~/lib/wrappers/Parameter";
import { useAuthentication } from "../authentication";

export const useParameters = defineStore('parameters', {
  state: () => ({
    parameter: null as Parameter,
    yOrigin: 0
  }),
  actions: {
    startParameterSetting($event: MouseEvent, parameter: Parameter) {
      this.parameter = parameter;
      this.yOrigin = $event.clientY;
    },
    moveParameterSetting($event: MouseEvent) {
      if (this.parameter === null) return;

      const delta = $event.clientY - this.yOrigin;
      if (Math.abs(delta) >= 5) {
        this.parameter.moveValue(- (delta / 5) * this.parameter.step);
        this.yOrigin = $event.clientY;
      }
    },
    endParameterSetting() {
      const auth_token: string = useAuthentication().session.token;
      const payload = {
        auth_token,
        parameters: [{id: this.parameter.id, value: this.parameter.value}]
      }
      api.put(`/modules/${this.parameter.mod.id}`, payload)
      this.parameter = null;
    }
  }
})