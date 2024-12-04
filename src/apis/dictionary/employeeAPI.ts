import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';

class EmployeeAPI extends baseApi {
  apiName = 'dictionary';
	controllerName = 'Employee';
}

export default new EmployeeAPI();