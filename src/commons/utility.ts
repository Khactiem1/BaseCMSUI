/**
 * Chứa các function tiện ích phía client của hệ thống
 * Chú ý: class này chỉ được phép chứa funcion, không được tự ý thêm property
 */
class Utility {
	/**
	 * Thực hiện duyệt từng phần tử của bảng hoặc thuộc tính của object để call fn
	 * @param {Array/Object/...} obj
	 * @param {Function} fn hàm thực hiện khi for
	 */
	forEach(obj: any, fn: any) {
		if (obj === null || typeof obj === 'undefined') {
			return;
		}

		// Force an array if not already something
		if (typeof obj !== 'object') {
			obj = [obj];
		}

		if (obj instanceof Array) {
			// Duyệt từng phần tử của mảng
			for (let i = 0, l = obj.length; i < l; i++) {
				fn.call(null, obj[i], i, obj);
			}
		} else {
			// nếu là Object thì duyệt từng thuộc tính
			for (let key in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, key)) {
					fn.call(null, obj[key], key, obj);
				}
			}
		}
	}
}

export default new Utility();
