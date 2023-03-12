import keyboardMapper from "~~/lib/types/keyboardMapper";
import midiListenerCallback from "~~/lib/types/midiListenerCallback";

interface ListenersList {
  noteOn: midiListenerCallback[];
  noteOff: midiListenerCallback[];
}

export const midiListeners: ListenersList = { noteOn: [], noteOff: [] };

function initKeyboardDevice() {
  const keyboardMapper: keyboardMapper = {
    //    70    72          75    77    79
    // 69    71    73    74    76    78    80
    KeyQ: 69, Digit2: 70, KeyW: 71, Digit3: 72, KeyE: 73, KeyR: 74, Digit4: 75, KeyT: 76, Digit5: 77, KeyY: 78, Digit6: 79, KeyU: 80
  };

  window.onkeydown = function(event: KeyboardEvent) {
    const found: boolean = Object.keys(keyboardMapper).includes(event.code);
    if (found) {
      triggerListeners(midiListeners.noteOn, keyboardMapper[event.code] as number);
    }
  }
}

/**
 * Initializes all the MIDI devices so that when a key is down or up it triggers the corresponding event.
 * It initializes the keyboard keys too so that it simulate MIDI notes when stroking keys.
 */
export function initMidiDevices() {
  initKeyboardDevice();
  navigator.requestMIDIAccess().then((access: MIDIAccess) => {
    for (let input of access.inputs.values()) {
      input.onmidimessage = (message: MIDIMessage) => {
        if (message.data[0] === 144) {
          triggerListeners(midiListeners.noteOn, message.data[1]);
        }
        else if (message.data[0] === 128) {
          triggerListeners(midiListeners.noteOff, message.data[1]);
        }
      }
    }
  })
}

function triggerListeners(listeners: midiListenerCallback[], pitch: number) {
  listeners.forEach(function(listener: midiListenerCallback) {
    listener(pitch);
  })
}

export function onKeyDown(callback: midiListenerCallback) {
  midiListeners.noteOn.push(callback);
}

export function onKeyUp(callback: midiListenerCallback) {
  midiListeners.noteOn.push(callback);
}