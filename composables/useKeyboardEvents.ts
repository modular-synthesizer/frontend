type KeyboardCallback = ($event: KeyboardEvent) => void;

const state: Ref<Record<string, KeyboardCallback[]>> = ref({});

function handleKeydown($event: KeyboardEvent) {
  if ($event.code in state.value) {
    state.value[$event.code].forEach((callback: KeyboardCallback) => callback($event))
  }
}

export function useKeyboardEvents() {
  window.removeEventListener('keydown', handleKeydown);
  window.addEventListener('keydown', handleKeydown);
  return {
    keydown(key: string, callback: KeyboardCallback) {
      if (!(key in state.value)) state.value[key] = [];
      state.value[key].push(callback);
    },
    cancel() {
      window.removeEventListener('keydown', handleKeydown);
    }
  }
}