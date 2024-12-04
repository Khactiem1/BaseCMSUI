import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';

class LayoutAPI extends baseApi {
  apiName = 'dictionary';
	controllerName = 'Layout';

  /**
	 * Lấy cấu hình layout theo Tag
	 */
	async getLayoutByTag(tag: any) {
		let request = {
			url: this.getAPIUrl() + `/get-layout-by-tag/${tag}`,
		};

		return await httpClient.getAsync(request);
	}

  /**
	 * Lấy cấu hình layout theo Tag
	 */
	async updateLayoutByTag(tag: any, config: any) {
		let request = {
			url: this.getAPIUrl() + `/update-layout-by-tag/${tag}`,
      data: {
        config: config,
      },
		};

		return await httpClient.postAsync(request);
	}
}

export default new LayoutAPI();
