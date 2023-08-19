import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import { eventbus } from "~~/lib/utils/eventbus/EventBus";
import Parameter from "~~/lib/wrappers/Parameter";
import sendParamEvent from '~~/lib/commands/events/sendParamEvent'
import { SynthState } from "../synthesizers/states";
import Synthesizer from "~~/lib/wrappers/Synthesizer";

const { EDITING_PARAMETER } = SynthState;

interface Payload {
  parameter: null | Parameter;
  yOrigin: number;
}

export const useParameters = defineStore('parameters', {
  state: (): Payload => ({
    parameter: null,
    yOrigin: 0
  }),
  getters: {
    synth(): Synthesizer {
      return useSynthesizerDetails().synthesizer as Synthesizer
    },
    username(): string {
      return useAuthentication().storedSession.username;
    }
  },
  actions: {
    startParameterSetting($event: MouseEvent, parameter: Parameter) {
      if (this.synth.isReadonly(this.username)) return;
      this.parameter = parameter;
      this.yOrigin = $event.clientY;
      useStates().setState(EDITING_PARAMETER);
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
      useStates().unblock();
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