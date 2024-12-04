import { openDialog } from 'vue3-promise-dialog';
import MsMessageBox from '@/components/messageBox/MsMessageBox.vue';
import { MSConstant } from '@/commons/wildcards';

const defaultWidth = 480;

/**
 * Có ẩn nút đóng trên msg bõ không
 * @param {*} title
 * @returns
 */
let isHideClose = (title: any) => {
	return title ? false : true;
};

/**
 * Show messsage lỗi màu đỏ
 * @param {*} title
 * @param {*} message
 * @param {*} width
 * @returns
 * @author ldlong 14.06.2023
 */
export function showError(message = '', title= '', msgProps = {}, width = null) {
	return openDialog(MsMessageBox, {
		type: MSConstant.MsgBoxType.Error,
		message: message,
		title: title,
		icon: 'iconError',
		hideClose: isHideClose(title),
		width: width ? width : defaultWidth,
		...msgProps
	});
}

/**
 * Show message cảnh báo (icon màu đỏ)
 * @param {*} title
 * @param {*} message
 * @param {*} width
 * @returns
 * @author ldlong 14.06.2023
 */
export function showWarning(message = '', title= '', msgProps = {}, width = null) {
	return openDialog(MsMessageBox, {
		type: MSConstant.MsgBoxType.Warning,
		message: message,
		title: title,
		icon: 'iconWarning',
		hideClose: true,
		width: width ? width : defaultWidth,
		...msgProps,
	});
}

/**
 * Show message cảnh báo xác nhận (icon màu vàng)
 * @param {*} title
 * @param {*} message
 * @param {*} width
 * @returns
 * @author ldlong 14.06.2023
 * @modified : nvquyet 07/08/2023 shor đường kẻ lên
 */
export function showAlert(message = "", title = "", msgProps = {}, width = null) {
	return openDialog(MsMessageBox, {
		type: MSConstant.MsgBoxType.Alert,
		message: message,
		title: title,
		hideClose: isHideClose(title),
		icon: 'iconAlert',
		width: width ? width : defaultWidth,
		//hasLineHr: false,//NVTOAN1 27.6.2023 Bỏ đường kẻ
		...msgProps,
	});
}

/**
 * Message cảnh báo
 * @param {*} title
 * @param {*} message
 * @param {*} width
 * @returns
 * @author ldlong 14.06.2023
 */
export function showConfirm(message = '', title= '', msgProps = {}, width = null) {
	return openDialog(MsMessageBox, {
		type: MSConstant.MsgBoxType.Confirm,
		message: message,
		title: title,
		icon: 'iconConfirm',
		hideClose: isHideClose(title),
		width: width ? width : defaultWidth,
		...msgProps,
	});
}

/**
 * Show messsage info
 * @param {*} title
 * @param {*} message
 * @param {*} width
 * @returns
 * @author ldlong 14.06.2023
 */
export function showInfo(message = '', title= '', msgProps = {}, width = null) {
	return openDialog(MsMessageBox, {
		type: MSConstant.MsgBoxType.Info,
		message: message,
		title: title,
		icon: 'iconInfo',
		hideClose: isHideClose(title),
		width: width ? width : defaultWidth,
	});
}
/**
 * Show messsage infoconfirm
 * @param {*} title
 * @param {*} message
 * @param {*} width
 * @returns
 * @author dvkhanh
 */
 export function showInfoConfirm(message = '', title= '', msgProps = {}, width = null) {
	console.log(message,title)
	return openDialog(MsMessageBox, {
		type: MSConstant.MsgBoxType.Confirm,
		message: message,
		title: title,
		icon: 'iconInfo',
		hideClose: isHideClose(title),
		width: width ? width : defaultWidth,
		...msgProps,
	});
}

/**
 * Message custom
 * @param {*} title
 * @param {*} message
 * @param {*} width
 * @returns
 * @author ldlong 14.06.2023
 */
export function showMsgCustom(msgProps = {}) {
	return openDialog(MsMessageBox, {
		type: MSConstant.MsgBoxType.Custom,
		...msgProps,
	});
}
