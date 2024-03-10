import Parameter from "~~/lib/wrappers/Parameter";

let display = ref<boolean>(false)
let parameter = useState<Parameter>();
const callbacks = ref<Callback[]>([])

type Callback = (parameter: Parameter) => void

export function useEditionModal() {

  function showParameter(param: Parameter) {
    display.value = true;
    parameter.value = param;

    callbacks.value.forEach((cb: Callback) => cb(parameter.value));
  }

  function whenOpened(callback: Callback) {
    callbacks.value.push(callback);
  }

  return { display, parameter, showParameter, whenOpened }
}