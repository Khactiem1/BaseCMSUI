<template>
  <div class="data-input ms-textarea ms-editor ms-validate">
    <div class="flex">
      <label class="label" v-if="label">{{ label }}</label>
      <div class="ms-textarea-required" v-if="rules && rules.find((_ : any) => _?.name == 'required')">&nbsp;{{textRequired}}</div>
	    <slot name="labelCustom"></slot>
    </div>
    <div class="flex-row">
      <textarea
        :title="internalText"
        class="ms-textarea-item input flex w-100"
        :placeholder="placeholder"
        v-model="internalText"
        :disabled="disabled"
        :readOnly="readOnly"
        :maxlength="maxLength"
        :autofocus = "autofocus"
        ref="input"
        :class="{ disabled: disabled , 'toUpper': toUpperCase, 'input-error': errorMessage}"
        v-on="listeners"
      />
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch, getCurrentInstance } from 'vue';
import msBaseComponent from '@/components/base/MsBaseComponent.vue';
import { useValidateControl } from '@/setup/validateControl';

export default defineComponent({
  extends: msBaseComponent,
  name: 'msInput',
  props: {
    /**
     * V-model bắn ra ngoài binding 2 chiều
     */
    modelValue: {
      default: null,
    },
    /**
     * Hiện thị chũ mờ ở dưới ô input
     * Created by LTDAT(22.06.2020)
     */
    placeholder: {
      default: null,
      type: [String],
    },
    //Giới hạn nhập của ô input
    maxLength: {
      default: null,
      type: Number,
    },
    //disabled
    disabled: {
      default: false,
      type: Boolean,
    },
    /**
     * Kí hiệu cảnh báo trường bắt buộc nhập không được bỏ trống
     * created by: hvanh 9-5-2023
     */
    textRequired: {
      type: String,
      default: '*',
      required: false,
    },
    /**
     * Auto focus khi có sự kiện mở form v.v
     * hvanh - 10.5.2023
     */
    autofocus: {
      default: false,
      type: [Boolean]
    },
    /**
     * Xem dữ liệu có cần viết hoa hay không
     * hvanh - 10.5.2023
     */
    toUpperCase: {
      type: Boolean,
			default: false
    },

	  /**
     * type
     */
    type: {
      type: String,
		  default: 'text'
    },
    autocomplete: {
      type: String,
      default: 'on'
    }
  },
  emits: [
    'msKeydown',
    'update:modelValue',
    'focus',
    'blur',
    'input',
    'msKeyup',
    'clickRightIcon',
    'paste',
  ],
  setup(props, { emit }) {
    //Variable
    let internalText = ref('');
    let focused = false;
    let displayValue = null;
    let input = ref(null);
    const { errorMessage, validate, isValidate, clearValidate } = useValidateControl({props});

    const { proxy }: any = getCurrentInstance();

    //Sự kiện focus vào ô input
    const onFocus = (e) => {
      focused = true;
      emit('focus', internalText.value, e);
    };

    //Sự kiên blur ra ngoài ô input
    const onBlur = (e) => {
      focused = false;
      validate();
      emit('blur', internalText.value, e);
    };

    //Reset lại giá trị về ban đầu
    const reset = () => {
      internalText.value = '';
      displayValue = null;
    };
    //Set giá trị cho ô input
    const setValue = (value) => {
      if (proxy.rules) {
        const rule = proxy.rules.find(
          (x) => x.name === 'pattern' && x.compareValue === 'phone'
        );
        if (rule && value) {
          value = value.replace(/ /g, '').replace(/\./g, '');
        }
      }
      internalText.value = value;
    };

    //Lấy giá trị ô input
    const getValue = () => {
      return internalText.value;
    };

    /**
     * Thiết lập mesage khi dữ liệu rỗng
     * Created by: nvtoan1 28.6.2023
     */
    const setError = (message) => {
      setTimeout(() => {
        proxy.errorMessage = message;
      });
    };

    /**
     * Hủy lan rộng event
     * HTHIEP 09.02.2022
     */
    const cancelEvent = (e) => {
      if (e) {
        if (typeof e.preventDefault === 'function') {
          e.preventDefault();
        }

        if (typeof e.stopPropagation === 'function') {
          e.stopPropagation();
        }

        if (typeof e.stopImmediatePropagation === 'function') {
          e.stopImmediatePropagation();
        }
      }
    };

    //Hooks
    //set internalText
    onMounted(() => {
      internalText.value = props.modelValue;
    });

    /**
     * Lắng nghe event => thò ra ngoài
     * HTHIEP 11.02.2022: Làm mịn, migration sang vue 3
     */
    const listeners = computed(() => {
      return {
        blur: (e) => {
          cancelEvent(e);
          onBlur(e);
        },
        focus: (e) => {
          cancelEvent(e);
          onFocus(e);
        },
        input: (e) => {
          cancelEvent(e);
          e.internalText = internalText.value; // DHHoang bổ sung fixbug: 59398
          emit('input', e, internalText.value);
        },
        keydown: (e) => {
          // e.stopPropagation();
          emit('msKeydown', e, internalText.value);
        },
        keyup: (e) => {
          emit('msKeyup', e, internalText.value);
        },
        paste: (e) => {
          emit('paste', e, internalText.value);
        },
      };
    });

    /**
     * Lắng nghe xử lý update lại modelValue
     * HTHIEP 11.02.2022: Làm mịn, sửa lại từ vue 2 sang vue 3
     */
    watch(
      () => internalText.value,
      (value) => {
        if (value !== props.modelValue) {
          emit('update:modelValue', value);
        }
      }
    );

    /**
     * Lắng nghe thay đổi modelValue set lại text cho input
     * HTHIEP 11.02.2022: Làm mịn, sửa lại từ vue 2 sang vue 3
     */
    watch(
      () => props.modelValue,
      (value) => {
        setValue(value);
      }
    );
    return {
      internalText,
      focused,
	    onFocus,
      listeners,
      reset,
      displayValue,
      input,
      getValue,
      errorMessage,
      validate,
      isValidate,
      clearValidate,
      setError,
    };
  },
});
</script>

<style lang="scss" scoped>
.data-input {
  position: relative;
}
.tool-tip {
  position: absolute;
  left: 18px;
  background-color: #505050;
  border-radius: 3px;
  padding: 2px 4px;
  z-index: 3;
  text-align: center;
  visibility: hidden;
  opacity: 0;
  color: var(--while__color);
  white-space: nowrap;
}
.data-input label:hover ~ .tool-tip {
  visibility: visible;
  opacity: 1;
}
textarea:disabled{
  background-color: #EFF0F2;
}
.ms-textarea-item {
  height: 64px;
  overflow: auto;
  padding: 6px 10px;
}
</style>
