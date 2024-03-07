import Parameter from "~~/lib/wrappers/Parameter";
import sendParamEvent from '~~/lib/commands/events/sendParamEvent'
import { api } from "~~/lib/api/Api";
import { eventbus } from "~~/lib/utils/eventbus/EventBus";
import { Strategies } from "./editionStrategy";
import { IControl } from "~~/lib/interfaces/IControl";

const strategy: Ref<Strategies> = ref(Strategies.DECORRELATED);

interface ParameterSettings {
  $event: MouseEvent;
  parameter: Parameter;
  control: IControl;
  mode: Strategies;
}

export function startParameterSetting({ $event, parameter, control, mode }: ParameterSettings, callback: () => void) {
  if (useSynthesizerDetails().synthesizer.isReadonly(useAuthentication().storedSession.username)) return;
  selectParameter({ parameter, control, x: $event.clientX, y: $event.clientY });
  strategy.value = mode;
  sendParamEvent('startEdit', parameter);

  startDragEvent($event, {
    move: moveParameterSetting,
    end: () => {
      endParameterSetting();
      callback();
    },
  });
}

export function moveParameterSetting(x: number, y: number) {
  EDITION_STRATEGIES[strategy.value]({ clientX: x, clientY: y })
}

export function endParameterSetting() {
  useStates().unblock();
  if (selectedParameter === null) return;
  saveParameter(selectedParameter as Parameter);
  sendParamEvent('endEdit', selectedParameter as Parameter);
  unselectParameter();
}

export async function saveParameter(param: Parameter): Promise<any> {
  const auth_token: string = useAuthentication().session.token;
  const payload = {
    auth_token,
    parameters: [{id: param.id, value: param.value}]
  }
  await api.put(`/modules/${param.mod.id}`, payload);
  eventbus.emit(`parameters/update/${param.mod.id}/channel`, { value: param.value });
}