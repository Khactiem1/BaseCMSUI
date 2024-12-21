import authService from "@/commons/authService";
import { showError } from "@/commons/globalMessage";

export const permission = {
	data() {
		return {
			/**
			 * mã phân hệ để kiểm tra phân quyền
			 */
			subSystemCode: null,
		};
	},
	methods: {
		/**
		 * Kiểm tra action command có quyền thực hiện không
		 * Dùng để kiểm tra khi click vào các nút trên form
		 * @param {string/array<string>} permission : quyền gì, nếu array thì 1 item pass là ok
		 * @param {string} subSystemCode : trường hợp gọi validate custom, chỉ định đích danh chức năng nào, không dùng cấu hình subSystemCode trong data
		 * @returns : true có quyền
		 */
		checkActionPermission(action, subSystemCode = null) {
      const me: any = this;
      if (!subSystemCode){
        subSystemCode = me.subSystemCode;
      }
      return authService.checkActionPermissonNotAsync(action, subSystemCode);
		},

		/**
		 * Kiểm tra quyền có cảnh báo
		 */
		checkActionPermissionAlert(action, subSystemCode = null) {
      const me: any = this;
      const result = me.checkActionPermission(action, subSystemCode);
      if (!result){
        const msg = me.$t('i18nCommon.notPermission');
        showError(msg);
        throw msg;
      }
      return result;
		},
	},
};
