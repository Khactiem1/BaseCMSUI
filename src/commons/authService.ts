import roleAPI from "@/apis/system/roleAPI";
import memoryCache from "@/cache/memoryCache";
import commonFn from "./commonFunction";

class AuthService {

  /**
   * Nếu là admin thì ko cần check quyền
   */
  public _isAdministrator: boolean = false;

  /**
   * Toàn bộ role của user
   */
  public allRole: any [] = [];

  /**
   * Lấy toàn bộ quyền về
   */
  async getAllPermission(){
    const me = this;
    const user = commonFn.getUser();
    if(user?.user_id){
      const allPermission = memoryCache.get("allPermissionByUser");
      if(allPermission){
        return allPermission;
      }
      commonFn.mask();
      const result = await roleAPI.GetPermissionByUser(user.user_id);
      commonFn.unmask();
      if(result.Success && result.Data?.length){
        result.Data.forEach(_ => {
          if(!_.is_administrator){
            _.list_permission = JSON.parse(_.list_permission);
          }
          else{
            me._isAdministrator = true;
          }
        });
        const resultConvert = result.Data.reduce((acc, item) => {
          acc[`${item.sub_system_code};_@${item.role_code}`] = item;
          if(!me.allRole.includes(`;_@${item.role_code}`)){
            me.allRole.push(`;_@${item.role_code}`);
          }
          return acc;
        }, {});
        memoryCache.set("allPermissionByUser", resultConvert);
        return resultConvert;
      }
    }
    return [];
  }

  /**
   * Check quyền action một ứng dụng
   * @param action 
   * @param subSystemCode 
   */
  async checkActionPermisson(action, subSystemCode){
    const me = this;
    const allPermission = await me.getAllPermission();
    return me.joinCheck(action, subSystemCode, allPermission);
  }

  /**
   * Check quyền action một ứng dụng, hàm này phải đảm bảo allPermission đã được load all
   * @param action 
   * @param subSystemCode 
   */
  checkActionPermissonNotAsync(action, subSystemCode){
    const me = this;
    const allPermission = memoryCache.get("allPermissionByUser");
    return me.joinCheck(action, subSystemCode, allPermission);
  }

  /**
   * Thực hiện join check quyền với nhiều role
   */
  joinCheck(action, subSystemCode, allPermission){
    const me = this;
    if (me._isAdministrator){
      return true;
    }
    if (allPermission){
      for (let i = 0; i < me.allRole.length; i++){
        let role = me.allRole[i];
        if(allPermission[`${subSystemCode}${role}`]?.list_permission?.[action]){
          return true;
        }
      }
    }
    return false;
  }
}

export default new AuthService();