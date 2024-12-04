/**
 * Object xử lý event global trên toàn bộ hệ thống
 */
import emitter from 'tiny-emitter/instance';

export default {
  $on: (...args: any) => emitter.on(...args),
  $once: (...args: any) => emitter.once(...args),
  $off: (...args: any) => emitter.off(...args),
  $emit: (...args: any) => emitter.emit(...args),
};

/**
 * Đối tượng liệt kê các global event đang có
 * Bắt buộc có globalEvent nào đều phải cấu hình vào đây để không bị trùng tên
 */
const GlobalEventName = {
  /**
   * Xử lý đóng tất form
   */
  closeAllPopup: 'closeAllPopup',
  scrollEvent: 'scrollEvent',
  reloadList: 'reloadList',
  resetPopupCenter: 'resetPopupCenter',
  setWaitingConfirm: 'setWaitingConfirm',
  showHelpViewHistory: 'showHelpViewHistory',
  sortEvent: 'sortEvent',
  updateNotification: 'updateNotification',
  closeAllDropdown: 'closeAllDropdown',
  controlFocus: 'controlFocus',
  controlBlur: 'controlBlur',
  gridFocus: 'gridFocus',
  gridBlur: 'gridBlur',
};

export { GlobalEventName };
