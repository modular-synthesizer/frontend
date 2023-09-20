<template>
  <div class="main-menu-wrapper" :style="style" ref="mainWrapper" v-if="visible">
    <div v-for="item in items" class="item-wrapper">
      {{ item.label }}
    </div>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';


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
    height: 20px;
    line-height: 20px;
  }
</style>