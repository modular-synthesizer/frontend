import { defineStore } from "pinia";
import IParameter from "~~/lib/interfaces/IParameter"

interface Payload {
  parameter: null|IParameter;
}

export const useParameterMenu = defineStore('parameterMenu', {
  state(): Payload {
    return {
      parameter: null,
    }
  },
  actions: {
    show(parameter: IParameter, $event: MouseEvent) {
      useContextMenus().display("parameters", $event);
      this.parameter = parameter;
    },
  }
})