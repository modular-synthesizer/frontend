import { has } from "lodash";
import type { Parameter } from "~/types/modules/Parameter";
import { eventbus } from "~/utils/eventbus/EventBus";
import { editParameterDebounced } from "~/features/synthesizers/shell/legacy/parameter.adapter";

type Handlers = {[key: string]: {[key: string]: Function}};

type State = {
  handlers: Handlers,
}

const state: Ref<State> = useState<State>('useMidiLearn', () => ({
  handlers: {},
}))

export function useMidiLearn() {
  function bindMidiLearn(k: number, parameter: Parameter) {
    if (!(parameter.id in state.value.handlers)) state.value.handlers[parameter.id] = {};

    state.value.handlers[parameter.id][k] = messageHandler(parameter);
    eventbus.subscribe(`midi/generalpurpose/${k}`, state.value.handlers[parameter.id][k]);
  }
  function messageHandler(parameter: Parameter) {
    return ({ amount }: any) => {
      editParameterDebounced(parameter, { kind: "midi", amount })
    }
  }
  return {
    state,
    get handlers(): Handlers { return state.value.handlers; },
    learn(parameter: Parameter) {
      const fct = ({ knob }: any) => {
        eventbus.unsubscribe("midi/generalpurpose", fct);
        bindMidiLearn(knob, parameter)
      }
      useContexts().hide();
      eventbus.subscribe("midi/generalpurpose", fct)
    },
    unlearn(parameter: Parameter) {
      const handlers = state.value.handlers;
      if(!has(handlers, parameter.id)) return;
      const keys: string[] = Object.keys(handlers[parameter.id]);
      keys.forEach((k: string) => {
        eventbus.unsubscribe(`midi/generalpurpose/${k}`, handlers[parameter.id][k]);
        delete handlers[parameter.id][k];
      })
    },
    messageHandler,
  }
}