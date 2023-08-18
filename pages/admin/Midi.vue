<template>
  <v-container>
    <h1>MIDI</h1>
    {{ messages }}
  </v-container>
</template>

<script type="ts" setup>
let midi = null; // global MIDIAccess object
let accesses = ref([]);
let messages = ref([]);

function onMIDISuccess(midiAccess) {
  console.log("MIDI ready!");
  midi = midiAccess;
  for (let access of listInputsAndOutputs(midi)) {
    accesses.value.push(access)
  }
  midiAccess.inputs.forEach((entry) => {
    entry.onmidimessage = onMIDIMessage;
  });
}

function onMIDIFailure(msg) {
  console.error(`Failed to get MIDI access - ${msg}`);
}

navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

function listInputsAndOutputs(midiAccess) {

  return [...midiAccess.inputs, ...midiAccess.outputs].map(entry => entry[1].name)
}

function onMIDIMessage(event) {
  let str = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `;
  const type = event.data[0];
  if (type >= 176 && type <= 191) {
    for (const character of event.data) {
      str += `${character} `;
    }
    messages.value.push(str)
  }
}
</script>