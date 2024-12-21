import axios from 'axios';
import Qs from 'qs';
import commonFn from '@/commons/commonFunction';
import moment from 'moment';
import Utility from '@/commons/utility';
import { showError } from '@/commons/globalMessage';
import i18n from '@/i18n/i18n';

// Danh sách đối tượng cần xử lý cancel request
let cancelRequests: any = [];

/**
 * Lớp này dùng để thao tác với restful
 */
class AxiosHttpClient {
	/**
	 * Khởi tạo các giá trị ngầm định của đối tượng làm việc với server
	 */
	constructor() {
		Utility.forEach(['post', 'put', 'patch', 'delete', 'get', 'head', 'options'], function forEachMethodWithData(method: any) {
			AxiosHttpClient.prototype[method] = function(config: any, method: any, isShowLoading = false, isCancelRequest = true, contenType = ApplicationJson) {
				let config1 = Object.assign(config || {}, { method: method });
				return this.callRequest(config1, method, isShowLoading, isCancelRequest, contenType);
			};
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
	 * @param method: POST, PUT, GET, DELTE
	 * @param isShowLoading: có cho loading hay không, hiển thị loading cho người dùng
	 * @param isCancelRequest: có cho phép hủy request cùng url và method hay không
	 * @param contenType: application/json, application/x-www-form-urlencoded, multipart/form-data
	 */
	async postAsync(config: any, isShowLoading = false, isCancelRequest = true, contenType = ApplicationJson) {
		return await this.requestAsync(config, POST, isShowLoading, isCancelRequest, contenType);
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
	 * @param method: POST, PUT, GET, DELTE
	 * @param isShowLoading: có cho loading hay không, hiển thị loading cho người dùng
	 * @param isCancelRequest: có cho phép hủy request cùng url và method hay không
	 * @param contenType: application/json, application/x-www-form-urlencoded, multipart/form-data
	 */
	async putAsync(config: any, isShowLoading = false, isCancelRequest = true, contenType = ApplicationJson) {
		return await this.requestAsync(config, PUT, isShowLoading, isCancelRequest, contenType);
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
	 * @param method: POST, PUT, GET, DELTE
	 * @param isShowLoading: có cho loading hay không, hiển thị loading cho người dùng
	 * @param isCancelRequest: có cho phép hủy request cùng url và method hay không
	 * @param contenType: application/json, application/x-www-form-urlencoded, multipart/form-data
	 */
	async deleteAsync(config: any, isShowLoading = false, isCancelRequest = true, contenType = ApplicationJson) {
		return await this.requestAsync(config, DELETE, isShowLoading, isCancelRequest, contenType);
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
	 * @param method: POST, PUT, GET, DELTE
	 * @param isShowLoading: có cho loading hay không, hiển thị loading cho người dùng
	 * @param isCancelRequest: có cho phép hủy request cùng url và method hay không
	 * @param contenType: application/json, application/x-www-form-urlencoded, multipart/form-data
	 */
	async getAsync(config: any, isShowLoading = false, isCancelRequest = true, contenType = ApplicationJson) {
		return await this.requestAsync(config, GET, isShowLoading, isCancelRequest, contenType);
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
	 * @param method: POST, PUT, GET, DELTE
	 * @param isShowLoading: có cho loading hay không, hiển thị loading cho người dùng
	 * @param isCancelRequest: có cho phép hủy request cùng url và method hay không
	 * @param contenType: application/json, application/x-www-form-urlencoded, multipart/form-data
	 */
	async requestAsync(config: any, method: any, isShowLoading = false, isCancelRequest = true, contenType = ApplicationJson) {
		try {
			// Cập nhật các tham số của headers
			this._processHeaders(config);

			// Cập nhật data
			this._processDataOrParams(config, method, contenType);

			// Lấy key trong danh sách hủy request
			// let key = this._getKey(config);

			// Thêm cancelrequest vào danh sách hủy
			// let cancelRequest = this._addCancelRequest(config, key, isCancelRequest);

			// Hiển thị loading
			this._setLoading(isShowLoading, true);

			// Thực hiện gọi service
			let result = await axios(config);

			// Ẩn loading
			this._setLoading(isShowLoading, false);

			// // Hủy request
			// this._removeRequest(cancelRequest, "finish");

			// Trả kết quả xử lý thành công
			if (result) {
				//xử lý kết quả trước khi return
				commonFn.processServerResponseData(result.data);

				return result.data;
			}

			// Trường hợp request bị hủy nên trả về empty dữ liệu
			return {
				Success: false,
				Data: null,
				Code: 0,
				Message: 'CancelRequest',
				MessageDev: ''
			};
		} catch (ex) {
			let error: any = ex;
			// Ẩn loading
			commonFn.unmask();
			//Unauthorized
			if (error && error.response && error.response.status === 401) {
				await showError(i18n.global.t('i18nCommon.Unauthorized'));
				commonFn.logout();
			}
			throw ex;
		}
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
	 * @param method: POST, PUT, GET, DELTE
	 * @param isShowLoading: có cho loading hay không, hiển thị loading cho người dùng
	 * @param isCancelRequest: có cho phép hủy request cùng url và method hay không
	 * @param contenType: application/json, application/x-www-form-urlencoded, multipart/form-data
	 */
	callRequest(config: any, method: any, isShowLoading = false, isCancelRequest = true, contenType = ApplicationJson) {
		try {
			// Cập nhật các tham số của headers
			this._processHeaders(config);

			// Cập nhật data
			this._processDataOrParams(config, method, contenType);

			// Hiển thị loading
			this._setLoading(isShowLoading, true);

			let promise = new Promise((resolve, reject) => {
				axios(config)
					.then(res => {
						let finalResult;

						if (config.resolveDefaultFormServer) {
							finalResult = res;
						} else {
							if (res) {
								//xử lý kết quả trước khi return
								commonFn.processServerResponseData(res.data);
								finalResult = res.data;
							} else {
								// Trường hợp request bị hủy nên trả về empty dữ liệu
								finalResult = {
									Success: false,
									Data: null,
									Code: 0,
									Message: 'CancelRequest',
									MessageDev: ''
								};
							}
						}

						// Ẩn loading
						this._setLoading(isShowLoading, false);

						resolve(finalResult);
					})
					.catch(ex => {
						// // pvduong1 - Nếu có lỗi liên quan đến auth thì hiện message
						// if (ex && ex.hasOwnProperty('request') && ex.request.status === 401) {
						// 	me.showMessageErrorRefreshToken(isShow);
						// }
						// let cancel = axios.isCancel(ex);
						reject(ex);
						// LogUtil.handleException(ex);
					});
			});

			return promise;
		} catch (ex) {
			let error: any = ex;
			// Log lỗi
			commonFn.unmask();
			//Unauthorized
			if (error && error.response && error.response.status === 401) {
				commonFn.logout();
			}

			// Ẩn loading


			throw ex;
			// // Trả kết quả lỗi
			// if (error && error.response) {
			//   return error.response.data;
			// }
		}
	}

	/**
	 * config: AxiosRequestConfig
	 * Chi tiết các thông tin trong config
	 * @param {
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
	 */
	_processDataOrParams(config: any, method: any, contenType = ApplicationJson) {
		if (!config) return;

		// Xử lý method
		config.method = method;

		switch (method) {
			case GET:
				// case DELETE:
				if (config.data) {
					let queryString = Qs.stringify(config.data || {});
					if (queryString) {
						config.url = [config.url, queryString].join(config.url.indexOf('?') === -1 ? '?' : '&');
					}
				}
				break;
			case POST:
			case PUT:
			case DELETE:
				if (contenType == FormUrlEncoded) {
					config.data = Qs.stringify(config.data || {});
				}

				if (config.data) {
					//xử lý date - loại bỏ múi giờ trước khi submit
					this.processSubmitData(config.data);
				}
				break;
		}
	}

	/**
	 * xử lý date - loại bỏ múi giờ trước khi submit
	 */
	processSubmitData(data: any, count = 0) {
		//tránh overflow
		if (count > 20) {
			return;
		}

		const me = this;
		for (let i in data) {
			let value = data[i];
			if (value) {
				if (typeof value.getFullYear === 'function') {
					data[i] = moment(value).format('YYYY-MM-DDTHH:mm:ss');
				} else if (Array.isArray(value)) {
					value.forEach(item => {
						me.processSubmitData(item, count + 1);
					});
				} else if (typeof value === 'object' && Object.keys(value).length > 0) {
					me.processSubmitData(value, count + 1);
				}
			}
		}
	}

	/**
	 * config: AxiosRequestConfig
	 * Chi tiết các thông tin trong config
	 * @param {
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
	 */
	_processHeaders(config: any, contenType = ApplicationJson) {
		if (!config) return;

		// Lấy dữ liệu của headers
		let headers = config.headers || {};

		if (!headers['Authorization']) {
			const user = commonFn.getUser();
			if(user?.access_token){
				headers['Authorization'] = `Bearer ${user.access_token}`;
			}
		}

		// Content type
		headers['Content-Type'] = contenType;

		// Cập nhật lại header
		config.headers = headers;

		//thiết lập timeout cho request
		if (!config.hasOwnProperty('timeout') && window._appConfig.axiosTimeout) {
			config.timeout = window._appConfig.axiosTimeout;
		}
	}

	/**
	 * Lấy key để cancel request theo config
	 * @param config
	 */
	_getKey(config: any) {
		if (!config) return '';
		return `${config.url}_${config.method}`;
	}

	/**
	 * Hàm này cho phép hủy request
	 * @param cancelRequest
	 */
	_removeRequest(cancelRequest: any, from: any) {
		try {
			if (!cancelRequest) return;

			// Hủy request
			if (cancelRequest.Value) {
				cancelRequest.Value.cancel();
			}

			// Xóa giá trị trong danh sách chờ hủy
			cancelRequests = cancelRequests.filter((n: any) => {
				return n.Key != cancelRequest.Key || (n.Key == cancelRequest.Key && n.Time != cancelRequest.Time);
			});
		} catch (ex) {
      
		}
	}

	/**
	 * Thêm vào danh sách hủy request
	 * @param config
	 * @param key
	 * @param isCancelRequest
	 */
	_addCancelRequest(config: any, key: any, isCancelRequest: any) {
		const me = this;
		try {
			//Lấy các request có key và cần hủy
			let requests = cancelRequests.filter((n: any) => n.Key == key && n.IsCancelRequest == true);
			if (requests != null && requests.length > 0) {
				requests.forEach((request: any) => this._removeRequest(request, 'add'));
			}

			// cancel token
			let cancelTokenSource = axios.CancelToken.source();

			// Cập nhật vào config
			config.cancelToken = cancelTokenSource.token;

			//Tạo yêu cầu hủy request
			let cancelRequest = {
				Key: key,
				Value: cancelTokenSource,
				Time: new Date().getTime(),
				IsCancelRequest: isCancelRequest
			};

			// Thêm vào danh sách chờ hủy request
			cancelRequests.push(cancelRequest);

			//Trả về tham số cancel request
			return cancelRequest;
		} catch (ex) {
		}

		return null;
	}

	/**
	 * Hàm này dùng để update trạng thái loading trong global state
	 * @param isShowLoading có cho loading hay không, hiển thị loading cho người dùng
	 * @param isLoading
	 * pvduy 13/05/2021: bỏ đi một control loading tránh lỗi 2 control loading khi sửa cất.
	 */
	_setLoading(isShowLoading: any, isLoading: any) {
		if (isShowLoading) {
			if (isLoading) {
				commonFn.mask();
			} else {
				commonFn.unmask();
			}
		}
	}
}

// Instance của axios client
export default new AxiosHttpClient();

// Các method của http
export const POST = 'POST';
export const PUT = 'PUT';
export const DELETE = 'DELETE';
export const GET = 'GET';

// Content-type
export const ApplicationJson = 'application/json';
export const FormUrlEncoded = 'application/x-www-form-urlencoded';
export const FormMultiPart = 'multipart/form-data';
