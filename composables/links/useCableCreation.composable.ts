import type { Cable, Port } from "~/types/Index"
import type { ModControl } from "~/types/blueprints/Control";
import type { ModControl as Control } from "~/types/blueprints/Control";
import type { Coordinates } from "~/types/utils/Coordinates";
import { connectCable, disconnectCable } from "~/utils/factories/cables";
import { add } from "~/utils/functions/geometry";

type ControlledPort = { port: Port, control: Control }

type CableState = Readonly<
  | { type: 'void' }
  | { type: 'started', origin: ControlledPort }
  | { type: 'magnetized', origin: ControlledPort, destination: ControlledPort }
>

const cableState: Ref<CableState> = ref({ type: 'void' })

function setState(newState: CableState) {
  console.log(newState)
  cableState.value = newState
}

function startCableCreation(port: Port, control: Control ) {
  setState({ type: 'started', origin: { port, control } })
}

function createCable(from: Port, to: Port): Cable {
  return { from, to, id: "", color: "red" }
}

function magnetizeToPort(port: Port, control: Control) {
  if (cableState.value.type !== 'started' || port.kind === cableState.value.origin.port.kind) return;
  setState({ type: 'magnetized', origin: cableState.value.origin, destination: { port, control } })
  connectAudio()
}

function connectAudio() {
  if (cableState.value.type !== 'magnetized') return
  connectCable(createCable(cableState.value.origin.port, cableState.value.destination.port))
}

function disconnectAudio() {
  if (cableState.value.type !== 'magnetized') return
  disconnectCable(createCable(cableState.value.origin.port, cableState.value.destination.port))
}

function unmagnetizeCable() {
  console.log("unmagnetized", cableState.value.type)
  if (cableState.value.type !== 'magnetized') return
  disconnectAudio()
  setState({ type: 'started', origin: cableState.value.origin })
}

function cancelCableCreation() {
  console.log("cancellation")
  setState({ type: 'void' })
}

function getCoordinates(control: ModControl|undefined) {
  if (control === undefined) return { x: 0, y: 0 };
  return add(control.payload as Coordinates, control.module);
}

export function useCableCreation() {
  return {
    end: cancelCableCreation,
    magnetize: magnetizeToPort,
    start: startCableCreation,
    unmagnetize: unmagnetizeCable,
    get origin(): Coordinates | undefined {
      if (cableState.value.type === 'void') return
      return getCoordinates(cableState.value.origin.control);
    },
    get destination(): Coordinates | undefined {
      switch(cableState.value.type) {
        case 'started': return useCoordinates().absolute()
        case 'magnetized': return getCoordinates(cableState.value.destination.control);
      }
    },
    get magnetized(): boolean {
      return cableState.value.type === 'magnetized'
    },
    get displayed(): boolean {
      return cableState.value.type !== 'void'
    },
    get startPort(): Port | undefined {
      if (cableState.value.type === 'void') return
      return cableState.value.origin.port
    },
    get endPort(): Port | undefined {
      if (cableState.value.type !== 'magnetized') return
      return cableState.value.destination.port
    },
    get cable(): Cable | undefined {
      if (cableState.value.type !== 'magnetized') return
      return { from: cableState.value.origin.port, to: cableState.value.destination.port, color: 'red', id: '' }
    }
  }
}