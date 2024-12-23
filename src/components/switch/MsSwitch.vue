<template>
	<label @click="lockEvent" class="ms-switch">
    <span class="label-left" v-if="labelLeft">{{ labelLeft }}</span>
		<input type="checkbox"
      v-model="computedValue"
      :disabled="disabled"
      :indeterminate="indeterminate"
      :true="trueValue"
      :false-value="falseValue"
      :value="value"
      :checked="checked"
    />
		<span class="checkmark">
			<span class="icon"></span>
		</span>
    <span class="label-right" v-if="labelRight">{{ labelRight }}</span>
	</label>
</template>
<script lang="ts">
import MsCheckbox from '@/components/checkbox/MsCheckbox.vue';
import { computed, toRefs } from 'vue';

export default {
	name: 'MsSwitch',
	extends: MsCheckbox,
	props: {
    labelRight: {
      type: String,
      default: null,
    },
    labelLeft: {
      type: String,
      default: null,
    }
	},
	setup(props, { emit }) {
    const { lockCheckBox } :any = toRefs(props);
    /**
     * Sự kiện bắn dữ liệu cập nhật cho component cha
     * Khắc Tiềm - 15.09.2022
     */
    const computedValue = computed({
      get() {
        if(!lockCheckBox.value){
          return props.modelValue;
        }
      },
      set(value) {
        if(!lockCheckBox.value){
          emit("update:modelValue", value);
          //custom sự kiện check không có value
          emit("custom-handle-click-checkbox"); 
          //custom sự kiện check có value truyền vào
          emit("custom-handle-click-checkbox-with-value", value); 
        }
      },
    });

    const lockEvent = (event: any) => {
      if(lockCheckBox.value){
        event.preventDefault(); 
      }
    }
		return {
      computedValue,
      lockEvent,
		};
	},
};
</script>
<style lang="scss" scoped>
.ms-switch{
  display: flex;
  position: relative;
  span{
    font-size: 14px;
    display: inline-block;
    &.label-left{
      padding-right: 6px;
    }
    &.label-right{
      padding-left: 6px;
    }
  }
  cursor: pointer;
  input {
    position: absolute;
    cursor: pointer;
    width: 20px;
    height: 20px;
    margin: 0;
    padding: 0;
    opacity: 0;
  }
  input:checked~.checkmark{
    background: var(--primary__color);
    text-align: right;
  }
  input:checked~.checkmark .icon{
    left: calc(100% - 18px);
  }
  .checkmark {
    display: inline-block;
    background: #bfbfbf;
    width: 40px;
    height: 20px;
    border-radius: 10px;
    padding: 2px;
    transition: background .2s ease;
    position: relative;
  }
  .icon {
    display: block;
    position: absolute;
    top: 2px;
    left: 2px;
    background: #fff;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    transition: left .2s ease;
  }
}
</style>
