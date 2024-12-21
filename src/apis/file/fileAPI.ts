import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';
import commonFn from '@/commons/commonFunction';
import axios from 'axios';

class fileAPI extends baseApi {
  apiName = 'file';
  controllerName = 'File';

  /**
   * Get ra url file để view
   */
  getFileViewUrl(fileName){
    return this.getAPIUrl() + `/view?fileName=${fileName}`;
  }
  
  /**
   * Tải file lên server
   */
  async uploadFile(file: any, path: string) {
    const formData = new FormData();

    // Thêm file vào formData
    formData.append('file', file);
    const user = commonFn.getUser();
    
    // Gửi file lên server
    const result = await axios.post(this.getAPIUrl() + `/upload?path=${path}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${user.access_token}`,
      }
    })
    if(result?.data){
      return result.data;
    }
    return {};
  }
}

export default new fileAPI();
