import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';

class UserAPI extends baseApi {
  apiName = 'dictionary';
	controllerName = 'User';

  /**
	 * Lấy cấu hình layout theo Tag
	 */
	async login(payload: any) {
		let request = {
			url: this.getAPIUrl() + "/Login",
      data: payload,
		};
		return await httpClient.postAsync(request);
	}

  /**
	 * Reset mật khẩu về mặc định
	 */
	async resetPassword(payload: any) {
		let request = {
			url: this.getAPIUrl() + "/reset_password",
      data: payload,
		};
		return await httpClient.postAsync(request);
	}
}

export default new UserAPI();