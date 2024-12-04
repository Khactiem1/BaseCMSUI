import { $vfm } from '@/lib/vueFinalModal/Plugin.js';
/**
 * Xử lý hiển thị popup
 */
class PopupUtil {
	/**
	 * Đối tượng cache lại các component popup
	 */
	_components = {};

	/**
	 * Danh sách các popup đang hiển thị
	 * key: tên popup
	 * value: instance
	 */
	_visible = {};

	/**
	 * Mở popup
	 * @param {string} name : Tên định danh
	 * @param {object} params : tham số
	 */
	show(name: string, params: any = {}) {
		if (!name) throw 'name is required';
		if (!params) {
			params = {};
		}
		let ps = params;
		ps.name = name;

		const popup = $vfm.show({ component: name }, ps);
		console.log(`Popup name: ${name}`);
		return popup;
		
	}
	/**
	 * Đóng popup
	 * @param {string} name 
	 */
	hide(name: string){
		try{
			if(name){
				$vfm.hide({ component: name })
			}
		}catch{
		}
	}

	/**
	 * Đóng tất cả popup đang mở
	 */
	hideAll() {
		$vfm.hideAll();
	}
}

export default new PopupUtil();
