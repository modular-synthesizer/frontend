import { defineStore } from "pinia";

export const useKnobEdition = defineStore('knobEdition', {
  state: () => ({
    displayDialog: false,
    coordinates: {x: 0, y: 0}
  }),
  actions: {
    closeDialog() {
      this.displayDialog = false;
    },
    openDialog(x: number, y: number) {
      this.coordinates = { x, y }
      console.log(this.coordinates);
      this.displayDialog = true;
    }
  }
});