import Parameter from '~~/lib/wrappers/Parameter';

// This composable holds the logic to know which parameter is currently being edited.
// It does not handle the edition itself, the value or the coordinates.

export let selectedParameter: Parameter|null = null;

export function selectParameter(parameter: Parameter) {
  selectedParameter = parameter;
  console.log(selectedParameter)
}

export function unselectParameter() {
  selectedParameter = null;
  console.log(selectedParameter)
}