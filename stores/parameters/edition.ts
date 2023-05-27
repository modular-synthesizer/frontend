import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import ParameterEditionCommand from "~~/lib/commands/ParameterEditionCommand";
import { eventbus } from "~~/lib/utils/eventbus/EventBus";
import Parameter from "~~/lib/wrappers/Parameter";

interface ParamEditionState {
  parameter?: Parameter;
  commands: ParameterEditionCommand[];
  yOrigin: number;
}

export const useParameters = defineStore('parameters', {
  state: () => ({ yOrigin: 0, commands: []} as ParamEditionState),
  actions: {
    startParameterSetting($event: MouseEvent, parameter: Parameter) {
      this.parameter = parameter;
      this.yOrigin = $event.clientY;
    },
    moveParameterSetting(_x: number, y: number) {
      if (this.parameter === undefined) return;

      const delta = y - this.yOrigin;
      if (Math.abs(delta) >= 5) {
        this.parameter.moveValue(- (delta / 5) * this.parameter.step);
        this.yOrigin = y;
      }
    },
    endParameterSetting() {
      if (this.parameter === undefined) return;
      this.saveParameter(this.parameter as Parameter);
      this.parameter = undefined;
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