import type { Synthesizer } from "~/types/Index";

type State = { x: number, y: number, synthesizer?: Synthesizer };

const state: Ref<State> = ref({ x: 0, y: 0, synthesizer: undefined });

const initialized: Ref<boolean> = ref(false);

/**
 * This composable automatically translates coordinates in the stage referential.
 * It takes a synthesizer, and applies its dx, dy and scale to get relative coordinates.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export function useCoordinates() {

  function setSynthesizer(newValue: Synthesizer) {
    state.value.synthesizer = newValue;
  }

  function get() {
    return {
      x: state.value.x,
      y: state.value.y,
    };
  }

  function update($event: MouseEvent) {
    if (state.value.synthesizer === undefined) return;
    const { x: sx, y: sy, scale } = state.value.synthesizer;
    state.value.x = Math.round($event.clientX / scale);
    state.value.y = Math.round($event.clientY / scale);
  }

  onMounted(() => window.addEventListener('mousemove', update, { capture: true }));
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { get, setSynthesizer, state };
}