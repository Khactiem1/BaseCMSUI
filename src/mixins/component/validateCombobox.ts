/**
 * Mixin xử lý validate combobox
 */
import i18nValidate from '@/i18n/vi/i18nValidate';
import {isNaN } from 'lodash-es';

export const validateCombobox = {
	/**
	 * @override
	 */
	validateRule(rule, editor, messageCustom, param) {
		const me = this;
		let res = true;
		let message = '',
			titleError = '';
		if (editor._isGridEditor) {
			titleError = editor.col.caption;
			editor = editor.msCombobox;
		} else {
			titleError = editor.getTitleError();
		}
		switch (rule) {
			case 'forceSelection':
				if (!me.validateForceSelection(editor)) {
					if (messageCustom) {
						message = messageCustom;
					} else {
						message = i18nValidate.messages[rule](titleError);
					}
				}

				break;
			case 'notSelectParent':
				if (!me.validateNotSelectParent(editor)) {
					if (messageCustom) {
						message = messageCustom;
					} else {
						message = i18nValidate.messages[rule]();
					}
				}
				break;
			case 'required':
				const controlValue = typeof editor.getValue === 'function' ? editor.getValue() : null;
				if (controlValue === undefined || controlValue === null || isNaN(controlValue) || controlValue === '') {
					if (messageCustom) {
						message = messageCustom;
					} else {
						message = i18nValidate.messages[rule](titleError);
					}
				}
				break;
		}
		if (!message && param) {
			message = param;
		}

		return message;
	},

	/**
	 * Xử lý force selection
	 * @param {*} editor
	 * @returns
	 * HTHIEP 01.07.2022: Sửa lại việc lấy item theo text => case thêm trường hợp có suffix
	 */
	validateForceSelection(editor) {
		const me = this;
		if (editor && editor.internalText) {
			//nếu là binding trên grid
			if (editor.$cell && editor.queryMode === 'remote' && !editor.lastRequestParam) {
				return true;
			}

			let dataSource = [];
			if (editor.enum) {
				dataSource = editor.$ms.commonFn.getEnumSource(editor.enum, '');
			}
			else {
				dataSource = editor.internalDataSource;
			}

			if (dataSource.length === 0 && !editor.internalText) {
				return true;
			}
			//nếu là binding thì trả về true
			// pvduy 29/06/2021: sửa lỗi khi hủy form thêm mới trên combobox thì ko cảnh báo.
			if (
				editor.internalText === editor.initText &&
				!editor.isForceQuery &&
				(!editor.forceSelection || editor.internalValue)
				// || editor.modelValue
			) {
				return true;
			}

			if (dataSource && dataSource.length > 0) {
				if (editor.value) {
					return true;
				}
				let valueText = editor.internalText;
				//check điều kiện trước khi gọi findItemByText() vì trường hợp là comboboxMultiSelect thì không thể validate bằng text sau khi nhập giá trị
				let items = null;
				//Trường hợp là combobox thường hoặc comboboxTree
				if (typeof editor.findItemByText == 'function') {
					items = editor.findItemByText(valueText, dataSource);
				} else {
					return true;
				}
				if (items && items.length) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		}
		return true;
	},
	/**
	 * ĐVThi 05/02/2020: Validate bắt buộc chọn con, không được chọn cha
	 */

	validateNotSelectParent(editor) {
		let item = editor.internalSelectedItem;
		if (item) {
			if (editor) {
				if (editor.isForceQuery) {
					let dataSource = editor.internalDataSource;
					if (dataSource && dataSource.length > 0) {
						if (editor.value) {
							return true;
						}
						let valueText = editor.internalText;
						//check điều kiện trước khi gọi findItemByText() vì trường hợp là comboboxMultiSelect thì không thể validate bằng text sau khi nhập giá trị
						let items = null;
						//Trường hợp là comboboxTree
						if (typeof editor.findItemByText == 'function') {
							items = editor.findItemByText(valueText);
						} else {
							return true;
						}
						if (items && items.length) {
							return !(items[0] && items[0].hasOwnProperty('IsParent') && items[0]['IsParent']);
						} else {
							return false;
						}
					} else {
						return false;
					}
				} else {
					let item = editor.internalSelectedItem;
					if (item && item.hasOwnProperty('IsParent') && item['IsParent']) {
						return false;
					}
				}
			}
		}
		return true;
	},
};
