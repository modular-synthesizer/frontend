<template>
  <g :transform="`translate(${x}, ${y})`">
    <polygon :points="points" fill="green" />
  </g>
</template>

<script lang="ts">

type Orientation = 'top'|'bottom'|'left'|'right'|'horizontal';

export default {
  props: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    orientation: { type: String as PropType<Orientation>, default: 'top'}
  },
  computed: {
    points(): string {
      const w = this.width;
      const h = this.height;
      switch(this.orientation) {
        case 'top':
          return `${h},0 ${w-h},0 ${w},${h} 0,${h}`;
        case 'bottom':
          return `0,0 ${w},0 ${w-h},${h} ${h},${h}`;
        case 'left':
          return `${w},0 ${w},${h} 0,${h-w} 0,${w}`;
        case 'right':
          return `0,0 ${w},${w} ${w},${h-w} 0,${h}`;
        case 'horizontal':
          const d = h/2;
          return `${d},0 ${w-d},0 ${w},${d} ${w-d},${h} ${d},${h} 0,${d}`;
      }
    }
  }
}
</script>