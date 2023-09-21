<template>
  <div class="main-menu-wrapper" :style="style" ref="mainWrapper" v-if="visible">
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
    widthVariable(): string {
      return `${this.width}px`;
    },
    height(): number {
      return 20 * this.items.length;
    },
    xCoord(): {[key: string]: string} {
      if (this.x + this.width > window.innerWidth) {
        return { left: `${Math.min(this.x, window.innerWidth) - this.width}px` }
      }
      else {
        return { left: `${this.x}px` }
      }
    },
    yCoord(): {[key: string]: string} {
      if (this.y + this.height > window.innerHeight) {
        return { top: `${Math.min(this.y, window.innerHeight) - this.height}px` }
      }
      else {
        return { top: `${this.y}px` }
      }
    },
    coordinates(): {[key: string]: string} {
      return {
        ...this.yCoord,
        ...this.xCoord
      }
    },
    style(): {[key: string]: any} {
      return {
        width:
        this.widthVariable,
        backgroundColor: this.backgroundColor,
        position: "absolute",
        color: this.textColor,
        ...this.coordinates,
      }
    }
  }
}
</script>

<style scoped>
  .main-menu-wrapper {
    position: absolute;
    font-size: 13px;
    padding: 2px 5px;
  }
  .item-wrapper {
    display: block;
    height: 20px;
    line-height: 20px;
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