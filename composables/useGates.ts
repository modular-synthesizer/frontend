/**
 * This file contains everything regarding gates declaration and triggering.
 * It allows us to add new gates, and to have a uniq setInterval for all gates.
 */

import Gate from "~~/lib/signal/gate";
import { GATES_INTERVAL } from "~~/lib/utils/constants";

const gates: Gate[] = [];

export function addGate(gate: Gate) {
  gates.push(gate);
}

function checkGates() {
  gates.forEach((gate: Gate) => {
    gate.check();
  })
}

export function initGates() {
  window.setInterval(checkGates, GATES_INTERVAL);
}