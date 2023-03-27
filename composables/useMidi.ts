import { find, get, includes, pull, some } from "lodash";
import KeyMapper from "~~/lib/interfaces/KeyMapper";
import keyboardMapper from "~~/lib/types/keyboardMapper";
import midiListenerCallback from "~~/lib/types/midiListenerCallback";

interface ListenersList {
  noteOn: midiListenerCallback[];
  noteOff: midiListenerCallback[];
}

let keyPressed: number[] = [];

export const midiListeners: ListenersList = { noteOn: [], noteOff: []};

export function initKeyboardDevice() {
  const keyboardMap: KeyMapper[] = [
    {key: "KeyQ", midicode: 69, channel: -1},
    {key: "Digit2", midicode: 70, channel: -1},
    {key: "KeyW", midicode: 71, channel: -1},
    {key: "Digit3", midicode: 72, channel: -1},
    {key: "KeyE", midicode: 73, channel: -1},
    {key: "KeyR", midicode: 74, channel: -1},
    {key: "Digit5", midicode: 75, channel: -1},
    {key: "KeyT", midicode: 76, channel: -1},
    {key: "Digit6", midicode: 77, channel: -1},
    {key: "KeyY", midicode: 78, channel: -1},
    {key: "Digit7", midicode: 79, channel: -1},
    {key: "KeyU", midicode: 80, channel: -1}
  ]
  // const keyboardMapper: keyboardMapper = {
  //   //    70    72          75    77    79
  //   // 69    71    73    74    76    78    80
  //   KeyQ: 69, Digit2: 70, KeyW: 71, Digit3: 72, KeyE: 73, KeyR: 74, Digit5: 75, KeyT: 76, Digit6: 77, KeyY: 78, Digit7: 79, KeyU: 80
  // };

  window.onkeydown = function(event: KeyboardEvent) {

    console.log(event.code);

    if (!some(keyboardMap, {key: event.code})) return;

    const mapper = find(keyboardMap, {key: event.code}) as KeyMapper;
    if (mapper.channel !== -1) return;
    const note = mapper.midicode;

    console.log(mapper, note);

    triggerListeners(midiListeners.noteOn, note, mapper);
  }

  window.onkeyup = function(event: KeyboardEvent) {
    const mapper = find(keyboardMap, {key: event.code});
    if (mapper === undefined) return;
    const note = mapper.midicode;

    if (note === undefined) return;
    pull(keyPressed, note);
    triggerListeners(midiListeners.noteOff, note, mapper);
  }
}

/**
 * Initializes all the MIDI devices so that when a key is down or up it triggers the corresponding event.
 * It initializes the keyboard keys too so that it simulate MIDI notes when stroking keys.
 */
// export function initMidiDevices() {
//   initKeyboardDevice();
//   navigator.requestMIDIAccess().then((access: MIDIAccess) => {
//     for (let input of access.inputs.values()) {
//       input.onmidimessage = (message: MIDIMessage) => {
//         if (message.data[0] === 144) {
//           triggerListeners(midiListeners.noteOn, message.data[1]);
//         }
//         else if (message.data[0] === 128) {
//           triggerListeners(midiListeners.noteOff, message.data[1]);
//         }
//       }
//     }
//   })
// }

function triggerListeners(listeners: midiListenerCallback[], pitch: number, mapper: KeyMapper) {
  listeners.forEach(function(listener: midiListenerCallback) {
    listener(pitch, mapper);
  })
}

export function onKeyDown(callback: midiListenerCallback) {
  midiListeners.noteOn.push(callback);
}

export function onKeyUp(callback: midiListenerCallback) {
  midiListeners.noteOff.push(callback);
}