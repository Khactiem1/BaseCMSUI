import { validateText } from '@/mixins/component/validateText';
// import { validateNumber } from '@/mixins/component/validateNumber';
import { ref, getCurrentInstance, computed } from 'vue';
// import { validateCombobox } from '@/mixins/component/validateCombobox';
// import i18nValidate from '@/i18ns/vi/i18nValidate';

export const ValidateRules = {
	required: 'required',
	moreThan: 'moreThan',
	lessThan: 'lessThan',
	equals: 'equals',
	pattern: 'pattern',
	diffierentZero: 'diffierentZero',
	custom: 'custom',
};

export const useValidateControl = ({ props }) => {
	const errorMessage = ref('');
	const isValidate = computed(() => props.rules.length > 0);
	const { proxy } = getCurrentInstance();
	const validate = (isValidateFromGrid) => {
		//Nếu là editor của grid thì sẽ lấy config từ column
		let rules = [];
		if (proxy._isGridEditor) {
			rules = props.col.rules;
		} else {
			rules = props.rules;
		}
		let message = '';
		if (Array.isArray(rules) && rules.length > 0) {
			for (let index = 0; index < rules.length; index++) {
				const rule = rules[index];
				if (rule) {
					//nktiem Bổ sung thêm cái messageCustom để cho các control có thể tự custom message của mình theo từng rule theo nghiệp vụ
					const { name, compareValue, customValidate, messageCustom } = rule;
					const controlValue = getValueControl();
					//Nếu có custom validate sẽ lấy theo customvalidate
					if (customValidate && typeof customValidate === 'function') {
						//nhgiang4 - truyền thêm context của control hiện tại
						let context = proxy;
						message = customValidate(controlValue, compareValue, getTitleError(), context);
						if (message) {
							break;
						}
					} else {
						if (proxy._isGridEditor && isValidateFromGrid) {
							message = proxy.errorMessage;
						} else {
							message = handlerRule(name, controlValue, compareValue, messageCustom);
						}
						if (message) {
							break;
						}
					}
				}
			}
		}
		errorMessage.value = message;
		return message;
	};
	/**
	 * Xử lý các rule validate
	 * @param {*} rule tên rule
	 * @param {*} compareValue value
	 * @returns
	 */
	const handlerRule = (rule, controlValue, compareValue, messageCustom) => {
		let message = '';

		const titleError = getTitleError();
		switch (rule) {
			case 'required':
				if (controlValue === undefined || controlValue === null || isNaN(controlValue) || controlValue === '') {
					if (messageCustom) {
						message = messageCustom;
					} else {
						// message = i18nValidate.messages[rule](titleError, proxy._isGridEditor);
					}
				}
				break;
			case 'moreThan':
				break;
			case 'lessThan':
				break;
			case 'equals':
				break;
			case 'pattern':
				if (!validateText.validateRule(compareValue, controlValue)) {
					if (messageCustom) {
						message = messageCustom;
					} else {
						// message = i18nValidate.messages['email'](titleError);
					}
				}
				break;
			case 'diffierentZero':
				// if (!validateNumber.validatediffierentZero(controlValue)) {
				// 	if (messageCustom) {
				// 		message = messageCustom;
				// 	} else {
				// 		// message = i18nValidate.messages['diffierentZero'](titleError);
				// 	}
				// }
				break;
			case 'notSelectParent':
				if (props.propsData?.data && props.col?.dataField && props.propsData.data[props.col.dataField]) {
					let currentItem = props.propsData.data[props.col.dataField].find((item) => item[props.col.dataField] == controlValue);
					if (currentItem && currentItem.hasOwnProperty('IsParent') && currentItem['IsParent']) {
						if (messageCustom) {
							message = messageCustom;
						} else {
							// message = i18nValidate.messages['notSelectParent']();
						}
					}
				}
				break;
			case 'max_refno':
				if (props.modelValue && props.modelValue.length > props.maxLength) {
					// message = i18nValidate.messages['max_refno'](props.label, props.maxLength);
				}
			default:
				break;
		}
		return message;
	};

	/**
	 * Xử lý validate riêng cho combobox
	 */
	const handlerValidateCombobox = (param) => {
		let rules = props.rules;
		if (proxy._isGridEditor) {
			rules = props.col.rules;
			if ((!props.col.rules || (props.col.rules && props.col.rules.length === 0)) && props.propsData && props.propsData.rules) {
				rules = props.propsData.rules;
			}
		}
		let message = '';
		if(props && typeof props.customValidateRules == 'function'){
			rules = props.customValidateRules(rules, props.dataRow, props.col);
		}
		if (Array.isArray(rules)) {
			for (let index = 0; index < rules.length; index++) {
				const rule = rules[index];
				if (rule) {
					//nktiem Bổ sung thêm cái messageCustom để cho các control có thể tự custom message của mình theo từng rule theo nghiệp vụ
					const { name, compareValue, customValidate, messageCustom } = rule;
					// message = validateCombobox.validateRule(name, proxy, messageCustom, param);
					if (message) {
						break;
					}
				}
			}
		}
		if (props.propsData?.callBack && typeof props.propsData?.callBack == 'function') {
			props.propsData.callBack(props.dataRow, errorMessage, message);
		} else {
			errorMessage.value = message;
		}

		return message;
	};

	const clearValidate = () => {
		errorMessage.value = '';
	};

	/**
	 * Lấy value của control (Các control override hàm này)
	 * @returns
	 */
	const getValueControl = () => {
		if (typeof proxy.getValue()?.trim == 'function') {
			//ntson5: trường hợp number/datetime thì sẽ ko trim đc
			return proxy.getValue().trim(); //kdlong 3.6.2023 fixbug 10389
		}
		return proxy.getValue();
	};

	/**
	 * Lấy title của error
	 * @returns
	 */
	const getTitleError = () => {
		const { title } = props;
		if (proxy._isGridEditor) {
			return props.col.caption;
		}
		return title || getValidateName();
	};

	/**
	 * Nếu control không khai báo name để hiển thị thông tin lỗi validate -> up parent find label
	 */
	const getValidateName = () => {
		let fn = function (el, c) {
			if (!el || c > 10) {
				return null;
			}

			let labelEl = el.querySelector('label');
			if (labelEl) {
				return (labelEl.innerText || '').replace('*', '');
			}

			return fn(el.parentNode, c + 1);
		};

		return fn(proxy.$el, 0);
	};

	//nhgiang4 - 03.11.2023: fixbug 50340
	const setErrorCustom = (mess) => {
		errorMessage.value = mess;
		if (proxy.dataRow) {
			proxy.internalText = proxy.dataRow[proxy.modelDisplayField];
		}
	};
	return {
		errorMessage,
		validate,
		handlerValidateCombobox,
		getTitleError,
		clearValidate,
		isValidate,
		setErrorCustom,
	};
};
