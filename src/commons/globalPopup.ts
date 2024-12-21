import { type App, defineAsyncComponent } from "vue";

/** Phần popup phân hệ */

/** Dictionary */
const EmployeeDetail = defineAsyncComponent(() => import('@/views/dictionary/employee/EmployeeDetail.vue'));

/** System */
const UserDetail = defineAsyncComponent(() => import('@/views/system/user/UserDetail.vue'));
const RoleDetail = defineAsyncComponent(() => import('@/views/system/role/RoleDetail.vue'));
const MenuDetail = defineAsyncComponent(() => import('@/views/system/menu/MenuDetail.vue'));

/** Phần popup hệ thống system */
const MsConfigLayoutList = defineAsyncComponent(() => import('@/components/layout/MsConfigLayoutList.vue'));
const TheSettingClamp = defineAsyncComponent(() => import('@/components/system/TheSettingClamp.vue'));

export const register = (app: App<Element>) => {
  app.component('EmployeeDetail', EmployeeDetail);
  app.component('UserDetail', UserDetail);
  app.component('RoleDetail', RoleDetail);
  app.component('MenuDetail', MenuDetail);
  app.component('MsConfigLayoutList', MsConfigLayoutList);
  app.component('TheSettingClamp', TheSettingClamp);
}