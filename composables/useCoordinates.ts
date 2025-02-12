import type { Coordinates, ScaledCoordinates } from "~/types/utils/Coordinates";
import { subtract } from "~/utils/functions/geometry";

type State = { x: number, y: number, reference?: ScaledCoordinates };

const state: Ref<State> = ref({ x: 0, y: 0, reference: undefined });

/**
 * This composable automatically translates coordinates in the stage referential.
 * It takes a synthesizer, and applies its dx, dy and scale to get relative coordinates.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export function useCoordinates() {

  function setReference(newValue: ScaledCoordinates) {
    state.value.reference = newValue;
  }

  function get(): Coordinates {
    return {
      x: state.value.x,
      y: state.value.y,
    };
  }

  function absolute(): Coordinates {
    return subtract(get(), state.value.reference ?? { x: 0, y: 0});
  }

  function update($event: MouseEvent) {
    if (state.value.reference === undefined) return;
    const { x: sx, y: sy, scale } = state.value.reference;
    state.value.x = Math.round($event.clientX / scale);
    state.value.y = Math.round($event.clientY / scale);
  }

  function initUpdates() {
    onMounted(() => window.addEventListener('mousemove', update, { capture: true }));
    onUnmounted(() => window.removeEventListener('mousemove', update));
  }

  return { absolute, get, initUpdates, setReference, state };
}