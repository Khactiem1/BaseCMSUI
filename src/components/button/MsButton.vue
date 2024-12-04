<template>
  <button :disabled="disabled" class="btn" :class="class" :title="tooltip">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    class: {
      type: String,
      default: "",
    },
    tooltip: {
      type: String,
      default: "",
    }
  },
  setup: () => {

    return { 

     };
  },
});
</script>

<style lang="scss" scoped>

</style>
