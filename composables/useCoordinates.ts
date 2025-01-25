import type { Synthesizer } from "~/types/Index";

type State = { x: number, y: number, synthesizer?: Synthesizer };

const state: Ref<State> = ref({ x: 0, y: 0, synthesizer: undefined });

/**
 * This composable automatically translates coordinates in the stage referential.
 * It takes a synthesizer, and applies its dx, dy and scale to get relative coordinates.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export function useCoordinates() {

  function setSynthesizer(newValue: Synthesizer) {
    state.value.synthesizer = newValue;
  }

  function update($event: MouseEvent) {
    if (state.value.synthesizer === undefined) return;
    const { x: sx, y: sy, scale } = state.value.synthesizer;
    state.value.x = Math.round($event.pageX / scale - sx);
    state.value.y = Math.round($event.pageY / scale - sy);
  }

  onMounted(() => window.addEventListener('mousemove', update, { capture: true }));
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { setSynthesizer, state };
}