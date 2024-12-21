import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';

class roleAPI extends baseApi {
  apiName = 'dictionary';
	controllerName = 'Role';
  
  /**
	 * Lấy cấu hình permission theo user_id
	 */
	async GetPermissionByUser(user_id: any) {
		let request = {
			url: this.getAPIUrl() + `/get_permission/${user_id}`,
		};

		return await httpClient.getAsync(request);
	}
}

export default new roleAPI();
