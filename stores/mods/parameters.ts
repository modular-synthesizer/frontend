import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import { eventbus } from "~~/lib/utils/eventbus/EventBus";
import Parameter from "~~/lib/wrappers/Parameter";

import sendParamEvent from '~~/lib/commands/events/sendParamEvent'

export const useParameters = defineStore('parameters', {
  state: () => ({
    parameter: null as Parameter,
    yOrigin: 0
  }),
  actions: {
    startParameterSetting($event: MouseEvent, parameter: Parameter) {
      this.parameter = parameter;
      this.yOrigin = $event.clientY;
      sendParamEvent('startEdit', parameter);
    },
    moveParameterSetting(_x: number, y: number) {
      if (this.parameter === null) return;

      const delta = y - this.yOrigin;
      if (Math.abs(delta) >= 5) {
        this.parameter.moveValue(- (delta / 5) * this.parameter.step);
        this.yOrigin = y;
      }
    },
    endParameterSetting() {
      if (this.parameter === null) return;
      this.saveParameter(this.parameter as Parameter);
      sendParamEvent('endEdit', this.parameter as Parameter);
      this.parameter = null;
    },
    async saveParameter(param: Parameter): Promise<any> {
      const auth_token: string = useAuthentication().session.token;
      const payload = {
        auth_token,
        parameters: [{id: param.id, value: param.value}]
      }
      await api.put(`/modules/${param.mod.id}`, payload);
      eventbus.emit(`parameters/update/${param.mod.id}/channel`, { value: param.value });
    }
  }
})