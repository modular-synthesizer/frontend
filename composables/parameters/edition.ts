type UseParameterState = {
  model: Ref
  parameter: Ref<Parameter>
  show: (parameter: Parameter) => void
}

function useParameterEditionTemplate(): () => UseParameterState {

  const model = ref(false);

  const parameter: Ref = ref(null)

  function show(p: Parameter) {
    model.value = true;
    parameter.value = p
  }

  return () => ({
    model, show, parameter
  })
}

export const useParameterEdition = useParameterEditionTemplate()