<template>
  <span>[{{ constraints.minimum }};{{ constraints.maximum}}] &#177; {{ constraints.step}} p {{ constraints.precision }}</span>
</template>

<script lang="ts">
export default {
  props: ['constraints']
}
</script>