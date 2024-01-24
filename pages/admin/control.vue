<template>
  <v-container>
  <v-slider v-model="angle" step="1" min="0" max="360"></v-slider></v-container>
  <svg height="500" width="1000">
    <defs>
      <linearGradient id="gradient">
        <stop offset="50%" stop-color="black" stop-opacity="0.5" />
        <stop offset="100%" stop-color="black" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="strongGradient">
        <stop offset="50%" stop-color="black" stop-opacity="0.7" />
        <stop offset="70%" stop-color="black" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="whiteGradient">
        <stop offset="50%" stop-color="white" stop-opacity="0.5" />
        <stop offset="55%" stop-color="white" stop-opacity="0.45" />
        <stop offset="100%" stop-color="white" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="strongWhiteGradient">
        <stop offset="50%" stop-color="white" stop-opacity="0.7" />
        <stop offset="70%" stop-color="white" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="backgroundGradient">
        <stop offset="0%" stop-color="black" stop-opacity="0.4" />
        <stop offset="100%" stop-color="white" stop-opacity="0.4" />
      </linearGradient>
      
      <linearGradient id="buttonBackground">
        <stop offset="0%" stop-color="black" stop-opacity="1" />
        <stop offset="50%" stop-color="#222" stop-opacity="1" />
        <stop offset="100%" stop-color="#111" stop-opacity="1" />
      </linearGradient>
      <linearGradient id="shadow">
        <stop offset="0%" stop-color="black" stop-opacity="1" />
        <stop offset="100%" stop-color="black" stop-opacity="0" />
      </linearGradient>
    </defs>
    <clipPath id="circleClip">
      <circle cx="0" cy="0" r="100" />
    </clipPath>
    <clipPath id="shadowClip">
      <rect x="10" y="-100" width="140" height="200" />
    </clipPath>
    <g transform="translate(500, 250)">
      <g transform="rotate(135)">
        <circle cx="0" cy="0" r="107" fill="url(#backgroundGradient)" />
      </g>
      <g :transform="`rotate(${angle})`">
        <circle cx="0" cy="0" r="102" fill="black" />
        <circle cx="0" cy="0" r="100" :fill="backgroundColor" />
        <g transform="rotate(90)">
          <circle cx="0" cy="0" r="100" fill="url(#gradient)" clip-path="url(#shadowClip)" />
          <circle cx="0" cy="0" r="100" fill="url(#strongGradient)" clip-path="url(#shadowClip)" />
        </g>
        <g transform="rotate(-90)">
          <circle cx="0" cy="0" r="100" fill="url(#whiteGradient)" clip-path="url(#shadowClip)" />
          <circle cx="0" cy="0" r="100" fill="url(#strongWhiteGradient)" clip-path="url(#shadowClip)" />
        </g>
        <rect x="-100" :y="-middleWidth" width="200" :height="2 * middleWidth" :fill="backgroundColor" clip-path="url(#circleClip)" class="middle-bar" />
        <rect x="-95" y="-2" width="30" height="4" fill="black" />
      </g>
    </g>


    <mask id="myMask"><!-- Tous les pixels blancs sont visibles -->
      
      <circle cx="0" cy="0" r="50" fill="white" />

      <template v-for="n in bumps">
        <g :transform="`rotate(${n * bumpAngle}) translate(70 0)`">
          <circle cx="0" cu="0" r="25" fill = white />
          <circle cx="0" cu="0" r="25" fill = black />
        </g>
      </template>

    </mask>
    <g transform="translate(750, 250)">
        <circle cx="0" cy="0" r="55" fill="#555555" />
      <g :transform="`translate(-5 15) rotate(115)`">
        <ellipse cx="0" cy="0" rx="50" ry="45" fill="url(#shadow)" />
      </g>
      <g :transform="`rotate(${angle})`">
        <circle cx="0" cy="0" r="50" mask="url(#myMask)" fill="url(#buttonBackground)" />
        <circle cx="0" cy="0" r="35" fill="#555555" />
        <circle cx="0" cy="0" r="32" fill="grey" />
        <circle cx="-42" cy="0" r="4" fill="white" />
        <foreignObject :transform="`translate(-${innerSize} -${innerSize})`" :width="doubleSize" :height="doubleSize">
          <div class="center" :style="{height: `${doubleSize}px`, width: `${doubleSize}px`}"></div>
        </foreignObject>
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
const backgroundColor: string = "#999999"
const middleWidth: number = 20;
const angle = ref(0);

const innerSize: number = 32
const doubleSize: number = 2 * innerSize;

const bumps: number = 7;
const bumpAngle: number = 360 / bumps;

</script>

<style scoped>
svg {
  background-color: #999999;
  margin: 10px auto;
}
.center {
  border-radius: 50%;
  background: conic-gradient(
    #a8a9ac 0deg,
    #d0d2d3 60deg,
    #acadb1 80deg,
    #d7d7d8 180deg,
    #c0c0c3 260deg,
    #e3e3e3 300deg,
    #a4a5a8 360deg
  );
}
</style>