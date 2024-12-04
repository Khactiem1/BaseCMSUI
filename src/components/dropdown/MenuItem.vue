<template>
  <li
    :class="[
      'menu-wrapper-item',
      icon ? 'd-flex menu-wrapper-item-icon' : '',
      { 'menu-border': seperatorBottom },
      { 'disabled-item': disabledItem },
    ]"
    role="menuitem"
    tabindex="-1"
    @click="emitClick"
    @keyup.enter="emitClick"
    @keyup.space="emitClick"
  >
    <template v-if="icon">
      <div :class="['menu-item-ic', icon]"></div>
      <div class="menu-item-content"><slot></slot></div>
    </template>
    <slot v-else></slot>
  </li>
</template>

<script lang="ts">
export default {
  props: {
    icon: {
      type: [Array, String],
      default: null,
    },
    seperatorBottom: {
      type: Boolean,
      default: false,
    },
    // disabled 1 item theo trạng thái nào đó VD theo mode
    disabledItem: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    emitClick() {
      this.$emit('menu-item-click');
    },
  },
};
</script>
<style lang="scss">
.menu-wrapper-item {
  font-weight: 400;
  font-size: 13px;
  &.menu-border {
    border-bottom: 1px solid #dadada;
  }
  &.menu-wrapper-item-icon {
    padding: 18px !important;
    white-space: nowrap;
    align-items: center;
  }
  .menu-item-ic {
    margin-right: 8px;
  }
  &.disabled-item {
    pointer-events: none;
    color: #afafaf;
  }
  &:hover{
    outline: 0;
    background-color: #eff1f3;
    border-radius: 2px;
    color: var(--primary__color);
    transition: all .2s ease;
  }
}
</style>
