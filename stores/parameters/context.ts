import { defineStore } from "pinia";
import Parameter from "~~/lib/wrappers/Parameter";

interface Payload {
  parameter: null|Parameter;
}

export const useParameterMenu = defineStore('parameterMenu', {
  state(): Payload {
    return {
      parameter: null,
    }
  },
  actions: {
    show(parameter: Parameter, $event: MouseEvent) {
      useContextMenus().display("parameters", $event);
      this.parameter = parameter;
    },
  }
})