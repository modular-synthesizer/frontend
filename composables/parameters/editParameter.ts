import Parameter from "~~/lib/wrappers/Parameter";
import sendParamEvent from '~~/lib/commands/events/sendParamEvent'
import { eventbus } from "~~/lib/utils/eventbus/EventBus";
import { Strategies } from "./editionStrategy";
import { IControl } from "~~/lib/interfaces/IControl";
import { repositories } from "~~/lib/repositories";

const strategy: Ref<Strategies> = ref(Strategies.DECORRELATED);

interface ParameterSettings {
  $event: MouseEvent;
  parameter: Parameter;
  control: IControl;
  mode: Strategies;
}

export function startParameterSetting({ $event, parameter, control, mode }: ParameterSettings, callback: () => void = () => {}) {
  if (useSynthesizer().synthesizer.value.isReadonly(useAuthentication().session.username)) return;
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
  repositories.modules.updateParameter(param);
  eventbus.emit(`parameters/update/${param.mod.id}/channel`, { value: param.value });
}