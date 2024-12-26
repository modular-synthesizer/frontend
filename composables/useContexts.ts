export interface ContextItem {
  label: string;
  action?: (payload: any) => void;
  url?: string;
}

export interface ContextOptions {
  payload?: any;
  items: ContextItem[]
}

type State = {
  x: number, y: number, visible: boolean, items: any[], payload: any
}

const state: Ref<State> = ref({
  x: 0,
  y: 0,
  visible: false,
  items: [] as any[],
  payload: null as any,
});

function hide(unblock: boolean = false) {
  if (unblock) useStates().unblock();
  state.value.visible = false;
}

export function useContexts() {
  window.addEventListener('click', () => hide());
  return {
    state,
    display($event: MouseEvent, options: ContextOptions) {
      useStates().setState(SynthState.DISPLAYING_CONTEXT);
      state.value.x = $event.clientX;
      state.value.y = $event.clientY;
      state.value.items = options.items;
      state.value.payload = options.payload;
      state.value.visible = true;
    },
    hide,
    get x() {
      return state.value.x;
    },
    get y() {
      return state.value.y;
    },
    get items() {
      return state.value.items;
    },
    get visible() {
      return state.value.visible;
    },
    get payload() {
      return state.value.payload;
    }
  }
}