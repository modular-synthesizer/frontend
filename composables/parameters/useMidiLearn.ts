import { has } from "lodash";
import { repositories } from "~/lib/repositories";
import type { Parameter } from "~/types/modules/Parameter";
import { setValue } from "~/utils/functions/parameters";
import { eventbus } from "~~/lib/utils/eventbus/EventBus";

type Handlers = {[key: string]: {[key: string]: Function}};

type State = {
  handlers: Handlers,
  timeout: number,
}

const state: Ref<State> = useState<State>('useMidiLearn', () => ({
  handlers: {}, timeout: -1,
}))

export function useMidiLearn() {
  function bindMidiLearn(k: number, parameter: Parameter) {
    if (!(parameter.id in state.value.handlers)) state.value.handlers[parameter.id] = {};

    state.value.handlers[parameter.id][k] = messageHandler(parameter);
    eventbus.subscribe(`midi/generalpurpose/${k}`, state.value.handlers[parameter.id][k]);
  }
  function messageHandler(parameter: Parameter) {
    return ({ amount }: any) => {
      if (state.value.timeout !== -1) window.clearTimeout(state.value.timeout);
      const ratio: number = amount / 127;
      const gap: number = parameter.maximum - parameter.minimum;
      
      const value: number = parameter.minimum + (gap * ratio);
      const step: number = parameter.step * 10
      const flooredValue: number = Math.floor(value / step) * step
      setValue(parameter, flooredValue);
      
      state.value.timeout = window.setTimeout(() => {
        parameter.t = Date.now();
        repositories.parameters.update(parameter, useSession().token)
        state.value.timeout = -1;
      }, 250);
    }
  }
  return {
    state,
    get handlers(): Handlers { return state.value.handlers; },
    get timeout(): number { return state.value.timeout; },
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