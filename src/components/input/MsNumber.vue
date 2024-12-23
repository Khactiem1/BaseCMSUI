<template>
	<div class="data-input ms-number ms-editor">
		<div class="flex">
			<label class="label" v-if="label">{{ label }}</label>
      <div class="ms-textarea-required" v-if="rules && rules.find((_ : any) => _?.name == 'required')">&nbsp;{{textRequired}}</div>
	    <slot name="labelCustom"></slot>
		</div>
		<div class="flex-row">
			<div class="w-100">
				<input
					ref="input"
					v-on="listeners"
					:placeholder="placeholder"
					:autofocus="autofocus"
					:step="step"
					:readOnly="readOnly"
          class="ms-input-item input is-number"
					:class="{ 'input-error': errorMessage }"
					:disabled="disabled"
					@keydown="upDownValue"
					@blur="onActionBlur"
					:maxlength="maxLength"
				/>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
			</div>
			<!-- <div class="ms-number-spin flex-column" v-if="spin">
				<div class="icon12 spin-up" @click="plus()"></div>
				<div class="icon12 spin-down" @click="less()"></div>
			</div> -->
		</div>
	</div>
</template>

<script lang="ts">
import AutoNumeric from 'autonumeric';
import msBaseComponent from '@/components/base/MsBaseComponent.vue';
import { useValidateControl } from '@/setup/validateControl';

export default {
	name: 'MsNumber',
	extends: msBaseComponent,
	props: {
		maxLength: {
			default: 14,
			type: Number
		},
		modelValue: {
			default: '',
			type: [String, Number]
		},
		/**
		 * Hiện thị chũ mờ ở dưới ô input
		 */
		placeholder: {
			default: null,
			type: [String]
		},
		/**
		 * Giá trị nhỏ nhất cho phép nhập
		 */
		min: {
			default: -10000000000,
			type: [Number, String]
		},
		/**
		 * Giá trị lớn nhất cho phép nhập
		 */
		max: {
			default: 100000000000000,
			type: [Number, String]
		},
		/**
		 * Tự động focus
		 */
		autofocus: {
			default: false,
			type: [Boolean]
		},
		/**
		 * Bước nhảy của giá trị
		 */
		step: {
			default: 1,
			type: [Number, String]
		},
		/**
		 * Trường bắt buộc nhập
		 * Mặc định false
		 */
		required: {
			type: Boolean,
			default: false
		},
		/**
		 * Kí hiệu cảnh báo trường bắt buộc nhập không được bỏ trống
		 */
		textRequired: {
			type: String,
			default: '*',
			required: false
		},
		/**
		 * Cho phép hiển thị số 0 ở đầu
		 * [`allow`, `deny`, `keep`]
		 * Mặc định là allow: Cho phép nhập nhưng sẽ mất khi focus ra bên ngoài
		 */
		leadingZero: {
			type: String,
			default: 'allow'
		},
		/**
		 * Cờ bật tắt icon tăng giảm giá trị của number
		 */
		spin: {
			type: Boolean,
			default: true
		},
		/**
		 * Format giá trị theo tùy chọn của hệ thống
		 */
		formatType: {
			type: [Number, String],
			default: 0
		},
		/**
		 * Cho phép hiển thị đầy đủ số lượng phần thập phân
		 */
		allowDecimalPadding: {
			type: Boolean,
			default: true
		},
		/**
		 * Cho phép phân tách các kí tự phần nguyên với nhau
		 */
		allowDigitGroupSeparator: {
			type: Boolean,
			default: true
		},
		/**
		 * Set giá trị default của number khi người dùng không set giá trị
		 */
		emptyInput: {
			type: Boolean,
			default: false
		},
		/**
		 * Cho phép có giá trị là null/undefined mà không phải set mặc định là 0
		 * @author NVLAM 28.02.2020
		 */
		isNullable: {
			type: Boolean,
			default: true
		},
		decimalPlaces: {
			default: 0,
			type: Number
		},
		/**
		 * Khi nhập vào auto formmat hàng thập phân đăng sau hay không
		 */
		hasFormatOnInput: {
			default: false,
			type: Boolean
		}
	},

	computed: {
		listeners() {
      const me: any = this;
			return {
				input: evt => {
					me.updateVModel();
					me.onInput();
				},

				keydown: event => {
					// event.stopPropagation();
					me.$emit('msKeydown', event);
					if ((event.key == 'Tab' || event.key == 'Enter' || event.key.includes('Arrow')) && me.isChange) {
						if (me.$refs.input) me.$emit('change', me.modelValue, event);
					}
				},
				focus: event => {
					me.selectOnClick = true;
					// pvduong1 - 06/04/2020 - Khi focus vào thì select all dữ liệu trong controll
					event.target.select();
					me.focused = true;
					me.$emit('focus', event);
					me.isChange = false;
				},
				blur: event => me.onBlur(event),
				change: e => {
					//   cancelEvent(e);
					if (me.$refs.input) me.$emit('change', me.modelValue, e);
				},
				paste: (e) => {
					me.$emit('paste', e);
				},
			};
		},
	},

	watch: {
		/**
		 * Sửa lại watch theo value theo hướng dẫn của anh bnduc
		 * @author pcminh 13.05.2020
		 * HTHIEP 25.01.2022: migration sang vue 3
		 */
		modelValue(newValue, oldValue) {
			const me: any = this;
			me.isChange = true;
			if (
				// Make sure this is only called when the value is set by an external script, and not from a user input
				me.getValue() !== newValue &&
				// Compare the 'newValue' with the current 'oldValue' so we do not `set` it again if it's not needed
				newValue !== oldValue
			) {
				// The modification comes from a script, so we need to reformat the new value `newValue.value`
				if (!newValue && typeof(newValue) != 'number') {
					me.autoNumeric.clear();
				} else {
					//me.autoNumeric.set(newValue);
					// me.setInternalValue(newValue);

					//nhgiang4 - fixbug 40113
					me.autoNumeric.rawValue = newValue;
					// && !me.$refs.input.value
					if (me.$refs.input && !me.$refs.input.value && !me.hasFormatOnInput) {
						me.autoNumeric.set(newValue)
					}
					//hvanh - 27.9.2023 - fixbug: 43097 - Nếu điều kiện này bằng true thì auto format luôn
					else if (me.hasFormatOnInput) {
						me.autoNumeric.set(newValue);
					}
					me.updateVModel();
				}
			}
		}
	},

	mounted() {
		// Initialize the autoNumeric element

		let me: any = this,
			options = me.initOptions();
		if (me.emptyInput) {
			options.emptyInputBehavior = 'zero';
		}
		//bỏ đi để control trên grid khi alt+tab xem số liệu ở chỗ khác quay lại thì bị select all text
		options.selectOnFocus = false;
		options.isCancellable = false; // nktiem - 15.10.2024 - Bổ sung config để khi nhấn esc thì control không undo về giá trị cũ
		me.$nextTick(() => {
      me.autoNumeric = new AutoNumeric(me.$refs.input, options);
      //kdlong 20.10.2023 fixbug 50490 setting đang mặc định là 1 => thư viện k can thiệp được nên phải gán lại
      if(me.autoNumeric && me.autoNumeric.settings && me.autoNumeric.settings.upDownStep){
        me.autoNumeric.settings.upDownStep = 0;
      }
      if (me.modelValue !== null && me.modelValue !== '' && typeof me.modelValue !== 'undefined') {
        if (me.modelValue > me.max || me.modelValue < me.min) {
          me.autoNumeric.set(me.max);
        } else {
          me.autoNumeric.set(me.modelValue);
        }
        // The `v-model` must be updated with that default value on startup
        me.updateVModel();
      }
    });
	},

	/**
	 * Chuyển một số biến không cần reactive vào đây để tối ưu
	 */
	created() {
		const me: any = this;

		/**
		 * Cờ xác định có phải người dùng đang thực hiện typing trên control hay không
		 */
		me.typing = false;
		me.valid = false;
		me.autoNumeric = null;
	},

	data() {
		return {
			focused: false,
			isChange: false
		};
	},
	emits: ['update:modelValue', 'msKeydown', 'onActionBlur', 'focus', 'change', 'paste'],
	methods: {
		/**
		 * Sự kiện blur
		 * NXCHIEN 17.05.2022
		 */
		onActionBlur() {
			this.$emit('onActionBlur', this.modelValue);
		},
		/**
		 * Thay đổi trạng thái focus
		 */
		changeFocus(booleanx) {
			this.focused = booleanx;
		},
		/**
		 * Sau sẽ bổ sung thêm DataType (Số tiền, Số lượng, tỷ lệ,...) để xác định đúng định dạng
		 * Việc khởi tạo này sau này sẽ để 1 object mặc định trên session để tối ưu
		 */
		initOptions() {
			let me: any = this;
			let numberFormat = {
        DecimalSeparator: ",",
        GroupSeparator: ".",
      };
			let options = {
				allowDecimalPadding: me.allowDecimalPadding, //Cho phép hiển thị đầy đủ số lượng phần thập phân
				decimalCharacter: numberFormat.DecimalSeparator, //Kí tự phân tách phần nguyên với phần thập phân
				digitGroupSeparator: numberFormat.GroupSeparator, //Kí tự phân tách phần nguyên với nhau
				decimalCharacterAlternative: '.',
				negativePositiveSignPlacement: 'p', //set vị trí dấu âm: [p - prefix, s - suffix, r - right, l - left]
				// emptyInputBehavior : 'zero', //set giá trị hiển thị mặc định khi number ko có giá trị là 0
				modifyValueOnWheel: 'false', //hỗ trợ có lăn chuột thay đổi giá trị hay không
				// currencySymbol: sessionObj.CurrencySymbol,
				currencySymbolPlacement: 's', //vị trị đặt dấu tiền tệ
				// roundingMethod: 'U',
				maximumValue: me.max,
				minimumValue: me.min,
				leadingZero: me.leadingZero, //cho phép giữ số 0 ở đầu,
        decimalPlaces: 0,
			};
			if (me.allowDigitGroupSeparator === false) {
				options.digitGroupSeparator = '';
			}
      options.decimalPlaces = me.decimalPlaces || 0;
			return options;
		},

		/**
		 * Update the v-model value and make the parent aware of that change.
		 *
		 * @param {Event} event This is needed if we want to use the `event.timeStamp` attribute
		 */
		updateVModel(event) {
			let me: any = this;
			if (me.autoNumeric != null) {
				let value = me.getValue();
				me.$emit('update:modelValue', value, event);
				//Khi được gán lại ở 1 nơi khác trước đây đang không update lên ui luôn
				if(!me.focused){
					me.autoNumeric.set(value);
				}
			}
		},

		upDownValue(e) {
			let me = this;
			if (me.spin) {
				if (e?.keyCode === 38) {
					e.preventDefault();
					this.plus();
				}
				if (e?.keyCode === 40) {
					e.preventDefault();
					this.less();
				}
			} else {
				if (me.isGridEditor) {
					let el: any = me.$refs.input;
					if (el.selectionStart == 0 && el.selectionEnd == el.value.length && (e.which == 39 || e.which == 37)) {
						let readOnly = el.readOnly;
						if (!el.readOnly) {
							el.readOnly = true;
						}
						setTimeout(function() {
							el.readOnly = readOnly;
						});
					}
				}
			}
		},
		plus() {
			//disable thì không làm gì
			if (this.disabled) {
				return;
			}

			this.changeFocus(true);
			let me: any = this;
			let value = me.getValue();
			if (!value) {
				value = 0;
			}
			value = Number(value);
			if (value < me.max) {
				value += me.step;
				me.autoNumeric.set(value);
				me.updateVModel();
				me.$nextTick(() => {
					this.$emit('change', me.getValue(), event);
				});
			}
		},
		less() {
			let me: any = this;
			//disable thì không làm gì
			if (me.disabled) {
				return;
			}

			me.changeFocus(true);
			let value = me.getValue();
			if (!value) {
				value = 0;
			}
			value = Number(value);
			if (value > me.min) {
				value -= me.step;
				me.autoNumeric.set(value);
				me.updateVModel();
				me.$nextTick(() => {
					this.$emit('change', me.getValue(), event);
				});
			}
		},
		/**
		 * Lấy giá trị của control
		 */
		getValue() {
			const me: any = this;
			if (!me.isNullable || me.autoNumeric.rawValue) {
				return me.autoNumeric.getNumber();
			}
		},
		/**
		 * Gán giá trị vào control
		 */
		setInternalValue(value) {
			let me: any = this;
			me.autoNumeric.set(value);
			me.updateVModel();
		},
		/**
		 * Sự kiện người dùng gõ vào ô input (dùng để bật cờ typing)
		 */
		onInput() {
      const me: any = this;
			me.typing = true;
		},

		onBlur() {
			const me: any = this;
			me.typing = false;
			me.changeFocus(false);//Khi blur ra thì update trạng thái focus
			me.validate();
		},
		setValue(value) {
			const me: any = this;
			if (me.$refs.input) {
				me.$refs.input.value = null;
			}

			if (me.autoNumeric && typeof value !== 'undefined' && value != null) {
				me.setInternalValue(value);
			} else {
				me.innerValue = value;
				me.$emit('update:modelValue', value);
				me.autoNumeric.rawValue = value || null;
			}
		}
	},
	setup(props) {
		const { errorMessage, validate, isValidate,clearValidate } = useValidateControl({
			props
		});
		return {
			errorMessage,
			validate,
			isValidate,
			clearValidate,
		};
	}
};
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
.is-number{
  text-align: right;
}
.input:disabled{
  background-color: #EFF0F2;
}
</style>
