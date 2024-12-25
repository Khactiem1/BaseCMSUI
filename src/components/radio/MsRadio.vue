<template>
  <label class="input-radio_check ms-radio" :class="{ active: isChecked, 'disabled' : disabled }">
    <input
      type="radio"
      :checked="isChecked"
      :value="value"
      :tabindex:="tab"
      :disabled="disabled"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement)?.value); 
      $emit('update:textField', label);"
    />
    <span class="info">{{ label }}</span>
    <span class="input-radio_focus"></span>
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    /**
     * Thuộc tính disable control
     */
     disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * Label hiển thị
     */
    label: { type: String, default: "", required: true },
    /**
     * Giá trị bind 2 chiều
     */
    modelValue: {},
    /**
     * Giá trị mặc định
     */
    value: {},
    tab: {},
  },
  computed: {
    /**
     * Khi check thì sẽ cập nhật giá trị model
     * Khắc Tiềm - 15.09.2022
     */
    isChecked() {
      return this.modelValue == this.value;
    },
  },
});
</script>

<style lang="scss" scoped>
.ms-radio{
  &.disabled{
    opacity: 0.6;
  }
}
.input-radio_check {
  align-items: center;
  cursor: pointer;
  position: relative;
  display: inline-block;
}
.input-radio_check + .input-radio_check {
  margin-left: 16px;
}
.input-radio_check::before {
  content: "";
  position: absolute;
  border-radius: 50%;
  left: 0;
  top: 0;
  width: 16px;
  height: 16px;
  border: solid 1px var(--border__input);
}
.input-radio_focus {
  position: absolute;
  border-radius: 50%;
  left: -4px;
  top: -4px;
  width: 24px;
  height: 24px;
  display: block;
  border: solid 1px #0076c04b;
  opacity: 0;
  visibility: hidden;
}
.input-radio_check input {
  position: absolute;
  opacity: 0;
}
.input-radio_check .info {
  padding-left: 28px;
}
.input-radio_check.active::before {
  border-color: var(--primary__color);
}
.input-radio_check::after {
  content: "";
  position: absolute;
  width: 14px;
  height: 14px;
  top: 1px;
  left: 1px;
  border-radius: 50%;
  background: var(--while__color);
}
.input-radio_check.active::after {
  width: 10px;
  height: 10px;
  top: 3px;
  left: 3px;
  background: var(--primary__color);
}
input:focus ~ .input-radio_focus {
  opacity: 1;
  visibility: visible;
}
</style>
