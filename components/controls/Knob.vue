<template>
  <knob-wrapper :parameter="mod.param(target)" :x="x" :y="y" :label="label" :control="control" />
</template>

<script setup lang="ts">
import { IControl } from "~~/lib/interfaces/IControl";
import Mod from "~~/lib/wrappers/Mod";

const { x, y, target, label, mod, control } = defineProps({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  target: { type: String, required: true },
  label: { type: String, default: "" },
  mod: { type: Mod, required: true },
  control: { type: Object as PropType<IControl>, required: true },
});
</script>