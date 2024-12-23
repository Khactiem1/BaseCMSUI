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
.btn:disabled {
  cursor: not-allowed; /* Thay đổi con trỏ để chỉ rõ trạng thái không bấm được */
  opacity: 0.6; /* Làm mờ nút */
}
</style>
