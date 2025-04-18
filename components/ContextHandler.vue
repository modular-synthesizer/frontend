<template>
  <div class="main-menu-wrapper" :style="coordinates" v-show="useContexts().visible">
    <div class="background-shadow"></div>
    <div class="items-wrapper">
      <template v-for="item in items">
        <a @click="triggerAction(item)" v-if="item.action" class="item-wrapper">{{ t(item) }}</a>
        <a :href="item.url" v-else-if="item.url" class="item-wrapper" target="_blank">{{ t(item) }}</a>
        <div v-else class="item-wrapper">{{ t(item) }}</div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { ContextItem } from '~~/composables/useContexts';

const WIDTH = 200;

export default {
  methods: {
    triggerAction(item: ContextItem) {
      useContexts().hide(true);
      if (!item.action) return;
      item.action(useContexts().payload);
    },
    t(item: any): string {
      return this.$t(`contexts.${item.label}`);
    },
  },
  computed: {
    x() {
      return useContexts().x
    },
    y() {
      return useContexts().y
    },
    height(): number {
      return 25 * this.items.length;
    },
    invertedX() {
      return useContexts().x + WIDTH > window.innerWidth
    },
    invertedY(): boolean {
      return useContexts().y + this.height > window.innerHeight
    },
    xCoord(): string {
      if (this.invertedX) return `${Math.min(this.x, window.innerWidth) - WIDTH}px`;
      return `${useContexts().x}px`;
    },
    yCoord(): string {
      if (this.invertedY) return `${Math.min(this.y, window.innerHeight) - this.height}px`;
      return `${useContexts().y}px`;
    },
    coordinates(): { [key: string]: string } {
      return { top: this.yCoord, left: this.xCoord }
    },
    items(): any[] {
      return useContexts().state.value.items;
    }
  }
}
</script>

<style scoped>
  .main-menu-wrapper {
    position: absolute;
    font-size: 13px;
    width: 200px;
    background-color: white;
    border: 1px solid silver;
  }
  .item-wrapper {
    padding: 0px 5px;
    display: block;
    height: 25px;
    line-height: 25px;
  }
  a.item-wrapper {
    cursor: pointer;
    text-decoration: none;
    color: black;
  }

  a.item-wrapper:hover {
    background-color: #DDDDDD;
  }
  .background-shadow {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 5px;
    left: 5px;
    background-color: silver;
    z-index: 0;
  }
  .items-wrapper {
    z-index: 1;
    position: relative;
    background-color: white;
  }
</style>