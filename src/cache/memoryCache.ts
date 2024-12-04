/**
 * Cache memory
 */
class memoryCache{
  constructor() { 
  }

  /**
   * Biến global chứa cache data
   * @private
   * (F5 là mất)
   */
   _cacheData = {};
 
  /**
   * Hàm set cache
   * @param {*} key cache key
   * @param {*} value cache data
   * @param {Number} expTime Thời gian hết hạn cache
   */
  set(key: any, value: any, expTime: any = null){
      try{
          let me: any = this;
          me._cacheData[key] = value;
          //Nếu có truyền thời gian sống thì sau khoảng thời gian sống sẽ xóa đi
          if(expTime){
              setTimeout(function () {
                  me.remove(key);
              }, expTime);
          }
      }catch(ex){
      }
  }

  /**
   * Hàm get cache
   * @param {*} key 
   */
  get(key: any){
      try{
          let me: any = this;
          return me._cacheData[key];
      }catch(ex){
      }
  }

  /**
   * Kiểm tra key đã tồn tại hay chưa
   * @param {*} key 
   * @returns boolean
   */
    hasKey(key: any) {
      try{
          let ret = localStorage.hasOwnProperty(key);
          return ret;
      }catch(ex){
      }
    }

  /**
   * Xóa cache theo cache key
   * @param {*} key 
   */
  remove(key: any){
      try{
          let me: any = this;
          delete me._cacheData[key];
      }catch(ex){
      }
  }

  /**
   * Xóa toàn bộ cache trong local storage
   */
  removeAll(){
    try{
        let me = this;
        me._cacheData = {}
    }catch(ex){
    }
  }
}
export default new memoryCache();