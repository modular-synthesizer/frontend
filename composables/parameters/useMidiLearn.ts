import sendParamEvent from "~~/lib/commands/events/sendParamEvent";
import { eventbus } from "~~/lib/utils/eventbus/EventBus";
import Parameter from "~~/lib/wrappers/Parameter";

type Handlers = {[key: string]: {[key: string]: Function}};

type State = {
  handlers: Handlers,
  timeout: number,
}

const state: Ref<State> = useState<State>('useMidiLearn', () => ({
  handlers: {}, timeout: -1,
}))

export function useMidiLearn() {
  return {
    state,
    get handlers(): Handlers { return state.value.handlers; },
    get timeout(): number { return state.value.timeout; },
    learn(parameter: Parameter) {
      const fct = ({ knob }: any) => {
        eventbus.unsubscribe("midi/generalpurpose", fct);
        this.bindMidiLearn(knob, parameter)
      }
      useContexts().hide();
      eventbus.subscribe("midi/generalpurpose", fct)
    },
    bindMidiLearn(k: number, parameter: Parameter) {
      if (!(parameter.id in this.handlers)) this.handlers[parameter.id] = {};

      this.handlers[parameter.id][k] = this.messageHandler(parameter);
      eventbus.subscribe(`midi/generalpurpose/${k}`, this.handlers[parameter.id][k]);
    },
    messageHandler(parameter: Parameter) {
      return ({ amount }: any) => {
        if (this.timeout !== -1) window.clearTimeout(this.timeout);
        const ratio: number = amount / 127;
        const gap: number = parameter.maximum - parameter.minimum;
        
        const value: number = parameter.minimum + (gap * ratio);
        const step: number = parameter.step * 10
        const flooredValue: number = Math.floor(value / step) * step
        parameter.setValue(flooredValue);
        
        state.value.timeout = window.setTimeout(() => {
          saveParameter(parameter);
          sendParamEvent('endEdit', parameter);
          state.value.timeout = -1;
        }, 250);
      }
    },
    unlearn(parameter: Parameter) {
      if(!(parameter.id in this.handlers)) return;
      const keys: string[] = Object.keys(this.handlers[parameter.id]);
      keys.forEach((k: string) => {
        eventbus.unsubscribe(`midi/generalpurpose/${k}`, this.handlers[parameter.id][k]);
        delete this.handlers[parameter.id][k];
      })
    }
  }
}