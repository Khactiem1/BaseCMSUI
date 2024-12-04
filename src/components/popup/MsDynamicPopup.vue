<template>
  <vue-final-modal
    :classes="
      'modal-container ' + (dockPosition ? 'docked ' : '') + classDetail
    "
    content-class="modal-content "
    v-slot="{ close }"
    v-bind="$attrs"
    :esc-to-close="escToClose"
    :drag="isDrag"
    :resize="resize"
    :content-style="styles"
    :click-to-close="false"
    drag-selector=".modal__title"
    class="ms-dynamic-popup"
    :transition="{
      'enter-active-class': '.3s cubic-bezier(.25,.8,.25,1)',
      'enter-class': 'translate-y-full',
      'enter-to-class': 'translate-y-0',
      'leave-active-class': 'transition duration-200 ease-in-out transform',
      'leave-to-class': 'translate-y-full',
      'leave-class': 'translate-y-0',
    }"
  >
    <div class="modal__title" v-if="hasTitle" :class="[{ modal__drag: isDrag }, classTitle]">
      <div class="title-left">
        <span class="title" @click="redirectClick">{{ title }}</span>
        <slot name="content-title"></slot>
      </div>
      <div class="title-right">
        <slot name="icon" :close="close"></slot>

        <div
          v-if="maximumable"
          @click="maximumClick"
          class="button icon24"
          :class="['button', maximum ? 'restore' : 'maximum']"
        ></div>
        <div
          v-if="isShowIconCloseDefault"
          class="button icon24 close"
          @click="close"
          :title="`${$t('i18nCommon.Close')} (ESC)`"
        ></div>
      </div>
    </div>
    <div class="modal__content flex-column flex1">
      <span
        class="popup-shortkey"
        @shortkey="shortkeyAction"
      ></span>
      <!-- v-shortkey="defaultShortKey" -->
      <slot name="content" :close="close"></slot>
    </div>
	<div class="modal__footer__line" v-if="$slots['footer']"></div>
    <div class="modal__footer" v-if="$slots['footer']">
      <slot name="footer" :close="close"></slot>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  onMounted,
  onUnmounted,
} from 'vue';
const { proxy }: any = getCurrentInstance();
const emit = defineEmits(['shortkeyAction', 'redirectClick']);
const props = defineProps({
  dragable: {
    type: Boolean,
    default: true,
  },
  hasTitle: {
	type: Boolean,
    default: true,
  },
  resize: {
    type: Boolean,
    default: false,
  },
  width: {
    type: Number,
    default: 0,
  },
  //Xử lý form muốn hiển thị theo % chiều rộng
  widthPercent: {
	type: Number,
	default: null,
  },
  height: {
    type: Number,
    default: 0,
  },
  title: {
    type: String,
    default: '',
  },
  maximum: {
    type: Boolean,
    default: false,
  },
  /**
   * Có hiển thị icon maxixum không
   */
  maximumable: {
    type: Boolean,
    default: false,
  },
  params: {
    type: Object,
    default: () => {},
  },
  classTitle: {
    type: String,
    default: '',
  },
  dockPosition: {
    type: String,
    default: null,
  },
  escToClose: {
    type: Boolean,
    default: true,
  },

  /**
   * Định nghĩa shortKey
   */
  shortkey: {
    default: null,
    type: [String, Object],
  },

  /**
   * class root
   */
  classDetail: {
    default: null,
    type: String,
  },
  // nhgiang4 - hiển thị icon close mặc định của popup hay không, mặc định hiển thị
  isShowIconCloseDefault: {
    type: Boolean,
    default: true
  }
});

let defaultShortKey = Object.assign(
  {
    Close: ['esc'], //Đóng
    Save: ['ctrl', 's'], //Cất
    SaveAndAdd: ['ctrl', 'shift', 's'], //Cất và thêm
    Help: ['f1'], //Giúp
    Print: ['ctrl', 'p'], //IN
    Maximum: ['ctrl', 'space'], //phóng to thu nhỏ form
    QuickSelect: ['f3'], //chọn nhanh
    Postpone: ['ctrl', 'u'], //hoãn
    Edit: ['ctrl', 'e'], // sửa
    Refresh: ['ctrl', 'r'], //load lại grid
    Delete: ['ctrl', 'd'], //xóa
    Duplicate: ['ctrl', 'shift', 'c'], //nhân bản
    Posted: ['ctrl', 'g'], //Ghi sổ
  },
  props.shortkey
);

const isDrag = computed(() => {
  if (props.maximum) return false;

  if (props.dockPosition) return false;
  return props.dragable !== false;
});

const styles = computed(() => {
  const style: any = {};
  if(props.widthPercent) {
	style.width = `${props.widthPercent}% `;
  } else if (props.width) {
	style.width = `${props.width}px`;
  }

  if (props.height) style.height = `${props.height}px`;

  if (props.maximum) {
    style.width = '100%';
    style.height = '100vh';
    style.top = 0;
    style.left = 0;
  }

  if (props.dockPosition) {
    style.height = '100vh';
    switch (props.dockPosition) {
      case 'left':
        style.left = 0;
        break;
      case 'right':
        style.right = 0;
        break;
    }
  }
  return style;
});

/**
 * Push el để xử lý shortkey cho view
 */
onMounted(() => {
  // proxy.$ms.commonFn.shortkeyPushView(proxy.$el);
});

/**
 * Loại bỏ el dùng cho shortkey
 */
onUnmounted(() => {
  // proxy.$ms.commonFn.shortkeyPopView(proxy.$el);
});
/**
 * emit event click title
 * bnanh 01.07.2022
 */
const redirectClick = () => {
  emit('redirectClick');
};

const maximumClick = () => {
  proxy.$emit('update:maximum', !props.maximum);
};

/**
 * emit event phím tắt
 */
const shortkeyAction = (e: any) => {
  let me = this;
  switch (e.srcKey) {
    default:
      emit('shortkeyAction', e);
      break;
  }
};
</script>

<style scoped lang="scss">
:deep(.modal-container) {
  display: flex;
  justify-content: center;
  align-items: center;
  &.docked {
    justify-content: unset;
  }
}
:deep(.modal-content) {
  position: absolute;
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  background: #fff;
}
.modal__content {
  flex: 1;
}
.modal__title {
  padding: 16px 20px;
  font-weight: 700;
  font-family: 'notosans-semibold';
  font-size: 19px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title-left {
    display: flex;
	align-items: center;
  }
  &:hover {
    cursor: move;
  }
  .title {
    color: #202104;
    margin-right: 32px;
    white-space: nowrap;
	cursor: text;
  }
  .button {
    cursor: pointer;
    display: inline-block;
    padding: 10px 8px;
  }

  .title-right {
    display: flex;
    align-items: center;
	column-gap: 10px;
  }
}
.modal__footer {
  padding: 0 20px;
  display: flex;
}
.modal__footer__line {
	margin: 0 20px;
}
.modal__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>
