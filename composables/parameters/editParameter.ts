import Parameter from "~~/lib/wrappers/Parameter";
import sendParamEvent from '~~/lib/commands/events/sendParamEvent'
import { api } from "~~/lib/api/Api";
import { eventbus } from "~~/lib/utils/eventbus/EventBus";
import { Strategies } from "./editionStrategy";

const { EDITING_PARAMETER } = SynthState;

const { DECORRELATED } = Strategies;

const strategy: Ref<Strategies> = ref(DECORRELATED);

export function startParameterSetting($event: MouseEvent, parameter: Parameter, mode: Strategies = DECORRELATED) {
  useContexts().hide();
  useStates().unblock();
  if (useSynthesizerDetails().synthesizer.isReadonly(useAuthentication().storedSession.username)) return;
  selectParameter(parameter, $event.clientY);
  strategy.value = mode;
  useStates().setState(EDITING_PARAMETER);
  sendParamEvent('startEdit', parameter);
}

export function moveParameterSetting(_: number, y: number) {
  EDITION_STRATEGIES[strategy.value](y)
}

export function endParameterSetting() {
  if (selectedParameter === null) return;
  useStates().unblock();
  saveParameter(selectedParameter as Parameter);
  sendParamEvent('endEdit', selectedParameter as Parameter);
  unselectParameter();
}

async function saveParameter(param: Parameter): Promise<any> {
  const auth_token: string = useAuthentication().session.token;
  const payload = {
    auth_token,
    parameters: [{id: param.id, value: param.value}]
  }
  await api.put(`/modules/${param.mod.id}`, payload);
  eventbus.emit(`parameters/update/${param.mod.id}/channel`, { value: param.value });
}