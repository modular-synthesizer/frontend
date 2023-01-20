<template>
  <tools-creator v-model="tool" @update:model-value="saveTool" />
</template>

<script lang="ts">
import ToolsFactory from '~~/lib/factories/ToolsFactory';

export default {
  data: () => ({
    tool: {
    "id": "",
    "name": "",
    "categoryId": "",
    "category": {
        "id": "",
        "name": ""
    },
    "nodes": [
        {
            "id": "",
            "name": "gain",
            "generator": "createGain"
        },
        {
            "id": "",
            "name": "lowpass",
            "generator": "lowpassBiquad"
        },
        {
            "id": "",
            "name": "highpass",
            "generator": "highpassBiquad"
        },
        {
            "id": "",
            "name": "bandpass",
            "generator": "bandpassBiquad"
        },
        {
            "id": "",
            "name": "lowshelf",
            "generator": "lowshelfBiquad"
        },
        {
            "id": "",
            "name": "highshelf",
            "generator": "highshelfBiquad"
        },
        {
            "id": "",
            "name": "peaking",
            "generator": "peakingBiquad"
        },
        {
            "id": "",
            "name": "notch",
            "generator": "notchBiquad"
        },
        {
            "id": "",
            "name": "allpass",
            "generator": "allpassBiquad"
        },
        {
            "id": "",
            "name": "cvgain",
            "generator": "createGain"
        },
        {
            "id": "",
            "name": "cvfrequency",
            "generator": "createGain"
        },
        {
            "id": "",
            "name": "cvq",
            "generator": "createGain"
        }
    ],
    "links": [
        {
            "id": "",
            "from": {
                "node": "gain",
                "index": 0
            },
            "to": {
                "node": "lowpass",
                "index": 0
            }
        },
        {
            "id": "",
            "from": {
                "node": "gain",
                "index": 0
            },
            "to": {
                "node": "highpass",
                "index": 0
            }
        },
        {
            "id": "",
            "from": {
                "node": "gain",
                "index": 0
            },
            "to": {
                "node": "bandpass",
                "index": 0
            }
        },
        {
            "id": "",
            "from": {
                "node": "gain",
                "index": 0
            },
            "to": {
                "node": "lowshelf",
                "index": 0
            }
        },
        {
            "id": "",
            "from": {
                "node": "gain",
                "index": 0
            },
            "to": {
                "node": "highshelf",
                "index": 0
            }
        },
        {
            "id": "",
            "from": {
                "node": "gain",
                "index": 0
            },
            "to": {
                "node": "peaking",
                "index": 0
            }
        },
        {
            "id": "",
            "from": {
                "node": "gain",
                "index": 0
            },
            "to": {
                "node": "notch",
                "index": 0
            }
        },
        {
            "id": "",
            "from": {
                "node": "gain",
                "index": 0
            },
            "to": {
                "node": "allpass",
                "index": 0
            }
        },
        {
            "id": "",
            "from": {
                "node": "cvq",
                "index": 0
            },
            "to": {
                "node": "lowpass.q",
                "index": 0
            }
        },
        {
            "id": "",
            "from": {
                "node": "cvq",
                "index": 0
            },
            "to": {
                "node": "highpass.q",
                "index": 0
            }
        },
        {
            "id": "",
            "from": {
                "node": "cvq",
                "index": 0
            },
            "to": {
                "node": "lowshelf.q",
                "index": 0
            }
        },
        {
            "id": "",
            "from": {
                "node": "cvq",
                "index": 0
            },
            "to": {
                "node": "highshelf.q",
                "index": 0
            }
        },
        {
            "id": "",
            "from": {
                "node": "cvq",
                "index": 0
            },
            "to": {
                "node": "peaking.q",
                "index": 0
            }
        },
        {
            "id": "",
            "from": {
                "node": "cvq",
                "index": 0
            },
            "to": {
                "node": "notch.q",
                "index": 0
            }
        },
        {
            "id": "",
            "from": {
                "node": "cvq",
                "index": 0
            },
            "to": {
                "node": "bandpass.q",
                "index": 0
            }
        },
        {
            "id": "",
            "from": {
                "node": "cvq",
                "index": 0
            },
            "to": {
                "node": "allpass.q",
                "index": 0
            }
        }
    ],
    "ports": [
        {
            "id": "",
            "name": "gain",
            "kind": "input",
            "index": 0,
            "target": "gain"
        },
        {
            "id": "",
            "name": "lowpass",
            "kind": "output",
            "index": 0,
            "target": "lowpass"
        },
        {
            "id": "",
            "name": "highpass",
            "kind": "output",
            "index": 0,
            "target": "highpass"
        },
        {
            "id": "",
            "name": "bandpass",
            "kind": "output",
            "index": 0,
            "target": "bandpass"
        },
        {
            "id": "",
            "name": "lowshelf",
            "kind": "output",
            "index": 0,
            "target": "lowshelf"
        },
        {
            "id": "",
            "name": "highshelf",
            "kind": "output",
            "index": 0,
            "target": "highshelf"
        },
        {
            "id": "",
            "name": "peaking",
            "kind": "output",
            "index": 0,
            "target": "peaking"
        },
        {
            "id": "",
            "name": "notch",
            "kind": "output",
            "index": 0,
            "target": "notch"
        },
        {
            "id": "",
            "name": "allpass",
            "kind": "output",
            "index": 0,
            "target": "allpass"
        },
        {
            "id": "",
            "name": "cvq",
            "kind": "input",
            "index": 0,
            "target": "cvq"
        }
    ],
    "parameters": [
        {
            "id": "",
            "name": "Q",
            "descriptorId": "63c9b3d40187980498416e05",
            "targets": [
                "lowpass",
                "highpass",
                "lowshelf",
                "highshelf",
                "peaking",
                "notch",
                "bandpass",
                "allpass"
            ],
            "constraints": {
                "minimum": 0,
                "maximum": 1000,
                "step": 1,
                "precision": 0
            }
        },
        {
            "id": "",
            "name": "volume",
            "targets": [
                "gain"
            ],
            "descriptorId": "6367c7eebbd88700076d7abf",
            "constraints": {
                "minimum": 0,
                "maximum": 10,
                "step": 0.01,
                "precision": 2
            }
        },
        {
            "id": "",
            "name": "frequency",
            "targets": [
                "lowpass",
                "highpass",
                "lowshelf",
                "highshelf",
                "bandpass",
                "allpass",
                "notch",
                "peaking"
            ],
            "descriptorId": "6367c7cbbbd88700076d7abd",
            "constraints": {
                "minimum": 20,
                "maximum": 2020,
                "step": 1,
                "precision": 0
            }
        },
        {
            "id": "",
            "name": "detune",
            "targets": [
                "lowpass",
                "highpass",
                "lowshelf",
                "highshelf",
                "bandpass",
                "allpass",
                "notch",
                "peaking"
            ],
            "descriptorId": "637bde211223cb00085fab81",
            "constraints": {
                "minimum": -1000,
                "maximum": 1000,
                "step": 1,
                "precision": 0
            }
        }
    ],
    "slots": 9,
    "controls": [
        {
            "id": "",
            "component": "Port",
            "payload": {
                "target": "highpass",
                "x": 30,
                "y": 320,
                "label": "HPS"
            }
        },
        {
            "id": "",
            "component": "Port",
            "payload": {
                "target": "highshelf",
                "x": 110,
                "y": 320,
                "label": "HSF"
            }
        },
        {
            "id": "",
            "component": "Port",
            "payload": {
                "target": "lowshelf",
                "x": 150,
                "y": 320,
                "label": "LSF"
            }
        },
        {
            "id": "",
            "component": "Port",
            "payload": {
                "target": "notch",
                "x": 30,
                "y": 360,
                "label": "NTH"
            }
        },
        {
            "id": "",
            "component": "Port",
            "payload": {
                "target": "peaking",
                "x": 70,
                "y": 360,
                "label": "PKG"
            }
        },
        {
            "id": "",
            "component": "Port",
            "payload": {
                "target": "bandpass",
                "x": 110,
                "y": 360,
                "label": "BPS"
            }
        },
        {
            "id": "",
            "component": "Port",
            "payload": {
                "target": "allpass",
                "x": 150,
                "y": 360,
                "label": "APS"
            }
        },
        {
            "id": "",
            "component": "Port",
            "payload": {
                "x": 70,
                "y": 320,
                "target": "lowpass",
                "label": "LPS"
            }
        },
        {
            "id": "",
            "component": "Knob",
            "payload": {
                "label": "gain",
                "x": 130,
                "y": 200,
                "target": "gain"
            }
        },
        {
            "id": "",
            "component": "LargeKnob",
            "payload": {
                "y": 60,
                "target": "Q",
                "label": "Q",
                "x": 90
            }
        },
        {
            "id": "",
            "component": "Knob",
            "payload": {
                "target": "frequency",
                "label": "frequency",
                "x": 50,
                "y": 200
            }
        },
        {
            "id": "",
            "component": "Port",
            "payload": {
                "target": "gain",
                "y": 150,
                "x": 90,
                "label": "IN"
            }
        }
    ]
}
  }),
  methods: {
    saveTool() {
      console.log(this.tool);
    }
  }
}
</script>