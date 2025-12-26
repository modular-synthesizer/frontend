type UseParameterState = {
  model: Ref
  show: () => void
}

function useParameterEditionTemplate(): () => UseParameterState {

  const model = ref(false)

  function show() {
    console.log(model.value)
    model.value = true;
    console.log(model.value)
  }

  return () => ({
    model, show
  })
}

export const useParameterEdition = useParameterEditionTemplate()