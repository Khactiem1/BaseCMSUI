import httpClient, { ApplicationJson, POST, PUT, GET, DELETE } from '@/apis/base/httpclient';
import commonFn from '@/commons/commonFunction';

export default class BaseAPI {
	baseUrl = '';
	controllerName = '';
	apiName = '';

	//khởi tạo ApiUrl
	//API được khởi tạo dựa trên apiName
	initAPI() {
		if (this.apiName) {
			this.baseUrl = window._apis[this.apiName] + this.controllerName;
		}
	}

	//Build api url
	getAPIUrl() {
		// Khi base url chưa khởi tạo
		if (this.baseUrl == '') {
			this.initAPI();
		}
		return this.baseUrl;
	}

	/**
	 * Khởi tạo và thực hiện call request
	 * @param {*} url
	 * @param {*} action
	 * @param {*} dataOrOptions
	 * @param {*} options
	 * @returns
	 */
	callRequest(url: any, action: any, dataOrOptions: any, options: any) {
		return new Promise((resolve, reject) => {
			action = action.toLowerCase();
			let fn = httpClient[action];

			if (fn) {
				fn.call(httpClient, url, dataOrOptions, options)
					.then((res: any) => {
						if (res.data.Success) {
							resolve(res.data);
						} else {
							reject(res.data);
						}
					})
					.catch((ex: any) => {
						reject(ex);
					});
			}
		});
	}

	/**
	 * config: AxiosRequestConfig
	 * @param config: {
	 * url?: string;
	 * method?: string;
	 * baseURL?: string;
	 * transformRequest?: AxiosTransformer | AxiosTransformer[];
	 * transformResponse?: AxiosTransformer | AxiosTransformer[];
	 * headers?: any;
	 * params?: any;
	 * paramsSerializer?: (params: any) => string;
	 * data?: any;
	 * timeout?: number;
	 * withCredentials?: boolean;
	 * adapter?: AxiosAdapter;
	 * auth?: AxiosBasicCredentials;
	 * responseType?: string;
	 * xsrfCookieName?: string;
	 * xsrfHeaderName?: string;
	 * onUploadProgress?: (progressEvent: any) => void;
	 * onDownloadProgress?: (progressEvent: any) => void;
	 * maxContentLength?: number;
	 * validateStatus?: (status: number) => boolean;
	 * maxRedirects?: number;
	 * httpAgent?: any;
	 * httpsAgent?: any;
	 * proxy?: AxiosProxyConfig | false;
	 * cancelToken?: CancelToken;
	 * }
	 * @param isShowLoading: có cho loading hay không, hiển thị loading cho người dùng
	 * @param isCancelRequest: có cho phép hủy request cùng url và method hay không
	 * @param contenType: application/json, application/x-www-form-urlencoded, multipart/form-data
	 */
	async postAsync(config: any, isShowLoading = false, isCancelRequest = true, contenType = ApplicationJson) {
		return await httpClient.requestAsync(config, POST, isShowLoading, isCancelRequest, contenType);
	}

	/**
	 * config: AxiosRequestConfig
	 * @param config: {
	 * url?: string;
	 * method?: string;
	 * baseURL?: string;
	 * transformRequest?: AxiosTransformer | AxiosTransformer[];
	 * transformResponse?: AxiosTransformer | AxiosTransformer[];
	 * headers?: any;
	 * params?: any;
	 * paramsSerializer?: (params: any) => string;
	 * data?: any;
	 * timeout?: number;
	 * withCredentials?: boolean;
	 * adapter?: AxiosAdapter;
	 * auth?: AxiosBasicCredentials;
	 * responseType?: string;
	 * xsrfCookieName?: string;
	 * xsrfHeaderName?: string;
	 * onUploadProgress?: (progressEvent: any) => void;
	 * onDownloadProgress?: (progressEvent: any) => void;
	 * maxContentLength?: number;
	 * validateStatus?: (status: number) => boolean;
	 * maxRedirects?: number;
	 * httpAgent?: any;
	 * httpsAgent?: any;
	 * proxy?: AxiosProxyConfig | false;
	 * cancelToken?: CancelToken;
	 * }
	 * @param isShowLoading: có cho loading hay không, hiển thị loading cho người dùng
	 * @param isCancelRequest: có cho phép hủy request cùng url và method hay không
	 * @param contenType: application/json, application/x-www-form-urlencoded, multipart/form-data
	 */
	async putAsync(config: any, isShowLoading = false, isCancelRequest = true, contenType = ApplicationJson) {
		return await httpClient.requestAsync(config, PUT, isShowLoading, isCancelRequest, contenType);
	}

	/**
	 * config: AxiosRequestConfig
	 * @param config: {
	 * url?: string;
	 * method?: string;
	 * baseURL?: string;
	 * transformRequest?: AxiosTransformer | AxiosTransformer[];
	 * transformResponse?: AxiosTransformer | AxiosTransformer[];
	 * headers?: any;
	 * params?: any;
	 * paramsSerializer?: (params: any) => string;
	 * data?: any;
	 * timeout?: number;
	 * withCredentials?: boolean;
	 * adapter?: AxiosAdapter;
	 * auth?: AxiosBasicCredentials;
	 * responseType?: string;
	 * xsrfCookieName?: string;
	 * xsrfHeaderName?: string;
	 * onUploadProgress?: (progressEvent: any) => void;
	 * onDownloadProgress?: (progressEvent: any) => void;
	 * maxContentLength?: number;
	 * validateStatus?: (status: number) => boolean;
	 * maxRedirects?: number;
	 * httpAgent?: any;
	 * httpsAgent?: any;
	 * proxy?: AxiosProxyConfig | false;
	 * cancelToken?: CancelToken;
	 * }
	 * @param isShowLoading: có cho loading hay không, hiển thị loading cho người dùng
	 * @param isCancelRequest: có cho phép hủy request cùng url và method hay không
	 * @param contenType: application/json, application/x-www-form-urlencoded, multipart/form-data
	 */
	async getAsync(config: any, isShowLoading = false, isCancelRequest = true, contenType = ApplicationJson) {
		return await httpClient.requestAsync(config, GET, isShowLoading, isCancelRequest, contenType);
	}

	/**
	 * config: AxiosRequestConfig
	 * @param config: {
	 * url?: string;
	 * method?: string;
	 * baseURL?: string;
	 * transformRequest?: AxiosTransformer | AxiosTransformer[];
	 * transformResponse?: AxiosTransformer | AxiosTransformer[];
	 * headers?: any;
	 * params?: any;
	 * paramsSerializer?: (params: any) => string;
	 * data?: any;
	 * timeout?: number;
	 * withCredentials?: boolean;
	 * adapter?: AxiosAdapter;
	 * auth?: AxiosBasicCredentials;
	 * responseType?: string;
	 * xsrfCookieName?: string;
	 * xsrfHeaderName?: string;
	 * onUploadProgress?: (progressEvent: any) => void;
	 * onDownloadProgress?: (progressEvent: any) => void;
	 * maxContentLength?: number;
	 * validateStatus?: (status: number) => boolean;
	 * maxRedirects?: number;
	 * httpAgent?: any;
	 * httpsAgent?: any;
	 * proxy?: AxiosProxyConfig | false;
	 * cancelToken?: CancelToken;
	 * }
	 * @param isShowLoading: có cho loading hay không, hiển thị loading cho người dùng
	 * @param isCancelRequest: có cho phép hủy request cùng url và method hay không
	 * @param contenType: application/json, application/x-www-form-urlencoded, multipart/form-data
	 */
	async deleteAsync(config: any, isShowLoading = false, isCancelRequest = true, contenType = ApplicationJson) {
		return await httpClient.requestAsync(config, DELETE, isShowLoading, isCancelRequest, contenType);
	}

	/**
	 * Lấy dữ liệu danh sách
	 */
	getList(payload: any) {
		let request = {
			url: this.getAPIUrl() + '/datapaging',
			data: payload,
		};

		return httpClient.postAsync(request);
	}

	/**
	 * Lấy bản ghi mặc định khi thêm mới
	 */
	getEdit(payload: any) {
		let request = {
			url: [this.getAPIUrl(), payload.id].join('/'),
		};

		return httpClient.getAsync(request);
	}

	/**
	 * Thêm mới
	 */
	insert(payload: any) {
		let request = {
			url: this.getAPIUrl(),
			data: payload,
		};
		return httpClient.postAsync(request, true);
	}

	/**
	 * Cập nhật
	 */
	update(payload: any, id: string) {
		let request = {
			url: [this.getAPIUrl(), id].join('/'),
			data: payload,
		};
		return httpClient.putAsync(request, true);
	}

	/**
	 * Xóa
	 */
	delete(payload: any) {
		let request = {
			url: [this.getAPIUrl(), payload.id].join('/'),
		};
		return httpClient.deleteAsync(request, true);
	}

  /**
   * Toggle Kích hoạt bản ghi (inactive)
   * NVTOAN1 23.5.2023 Move vào đây để dùng chung cho tất cả danh mục
   */
  inactive(payload: any) {
    let request = {
      url: this.getAPIUrl() + '/update_inactive',
      data: payload,
    };
    return httpClient.postAsync(request);
  }

	/**
	 * API xoá hàng loạt bản ghi
	 */
	deleteMultiple(payload: any){
		let request = {
      url: this.getAPIUrl() + '/delete_multiple',
      data: payload,
    };
    return httpClient.postAsync(request);
	}

	/**
	 * API khôi phục dữ liệu đã bị xoá theo mã
	 */
	restoreDataDelete(payload: any){
		let request = {
      url: this.getAPIUrl() + '/restore_data_delete',
      data: payload,
    };
    return httpClient.postAsync(request);
	}

	/**
	 * Lấy dữ liệu combobox load paging
	 */
	getComboboxPaging(payload: any) {
		let param = { ...payload };
		//xử lý tham số trước khi request load dữ liệu
		commonFn.processComboboxParamRequest(param);
		let request = {
			url: this.getAPIUrl() + '/datapaging',
			data: param,
		};

		return httpClient.postAsync(request);
	}

	/**
	 * Export data ra file excel
	 * @param payload 
	 * @returns 
	 */
	exportData(payload: any){
		let request = {
      url: this.getAPIUrl() + '/export_data',
      data: payload,
			responseType: 'blob', // Nhận Blob
    };
    return httpClient.postAsync(request, false, false, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	}
}
