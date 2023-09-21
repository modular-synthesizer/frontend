<template>
  <div class="main-menu-wrapper" :style="coordinates" ref="mainWrapper" v-if="visible">
    <template v-for="item in items">
      <a @click="triggerAction(item)" v-if="item.action" class="item-wrapper">{{ item.label }}</a>
      <a :href="item.url" v-else-if="item.url" class="item-wrapper" target="_blank">{{ item.label }}</a>
      <div v-else class="item-wrapper">{{ item.label }}</div>
    </template>
  </div>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { ContextItem } from '~~/stores/common/contexts';

export default {
  name: 'ContextHandler',
  props: {
    width: {
      type: Number,
      default: 200
    },
    backgroundColor: {
      type: String,
      default: "white"
    },
    textColor: {
      type: String,
      default: "black",
    },
  },
  setup() {
    return {
      mainWrapper: ref(null)
    }
  },
  methods: {
    triggerAction(item: ContextItem) {
      useContexts().hide();
      if (!item.action) return;
      item.action(useContexts().payload);
    },
  },
  computed: {
    ...mapState(useContexts, ['x', 'y', 'visible', 'items']),
    height(): number {
      return 25 * this.items.length;
    },
    xCoord(): string {
      if (this.x + this.width > window.innerWidth) {
        return `${Math.min(this.x, window.innerWidth) - this.width}px`
      }
      else {
        return `${this.x}px`
      }
    },
    yCoord(): string {
      if (this.y + this.height > window.innerHeight) {
        return `${Math.min(this.y, window.innerHeight) - this.height}px`
      }
      else {
        return `${this.y}px`
      }
    },
    coordinates(): Styles {
      return { top: this.yCoord, left: this.xCoord }
    },
  }
}
</script>

<style scoped>
  .main-menu-wrapper {
    position: absolute;
    font-size: 13px;
    width: 200px;
    background-color: white;
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
</style>