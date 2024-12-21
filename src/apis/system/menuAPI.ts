import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';

class menuAPI extends baseApi {
  apiName = 'dictionary';
	controllerName = 'Menu';
  
}

export default new menuAPI();