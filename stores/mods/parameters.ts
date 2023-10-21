import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import { eventbus } from "~~/lib/utils/eventbus/EventBus";
import Parameter from "~~/lib/wrappers/Parameter";
import sendParamEvent from '~~/lib/commands/events/sendParamEvent'
import { SynthState } from "../synthesizers/states";
import Synthesizer from "~~/lib/wrappers/Synthesizer";

const { EDITING_PARAMETER } = SynthState;

interface Payload {
  yOrigin: number;
}

export const useParameters = defineStore('parameters', {
  state: (): Payload => ({
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
      useContexts().hide();
      useStates().unblock();
      if (this.synth.isReadonly(this.username)) return;
      selectParameter(parameter);
      this.yOrigin = $event.clientY;
      useStates().setState(EDITING_PARAMETER);
      sendParamEvent('startEdit', parameter);
    },
    moveParameterSetting(_x: number, y: number) {
      if (selectedParameter === null) return;

      const delta = y - this.yOrigin;
      if (Math.abs(delta) >= 5) {
        selectedParameter.moveValue(- (delta / 5) * selectedParameter.step);
        this.yOrigin = y;
      }
    },
    endParameterSetting() {
      if (selectedParameter === null) return;
      useStates().unblock();
      this.saveParameter(selectedParameter as Parameter);
      sendParamEvent('endEdit', selectedParameter as Parameter);
      unselectParameter();
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