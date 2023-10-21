import Parameter from '~~/lib/wrappers/Parameter';

// This composable holds the logic to know which parameter is currently being edited.
// It does not handle the edition itself, the value or the coordinates.

export let selectedParameter: Parameter|null = null;

export const yOrigin: Ref<number> = ref(0);

export function selectParameter(parameter: Parameter, origin: number = 0) {
  selectedParameter = parameter;
  yOrigin.value = origin;
}

export function resetOrigin(y: number) {
  yOrigin.value = y;
}

export function unselectParameter() {
  selectedParameter = null;
  yOrigin.value = 0;
}