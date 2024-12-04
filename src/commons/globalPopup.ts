import { type App, defineAsyncComponent } from "vue";

const EmployeeDetail = defineAsyncComponent(() => import('@/views/dictionary/employee/EmployeeDetail.vue'));
const MsConfigLayoutList = defineAsyncComponent(() => import('@/components/layout/MsConfigLayoutList.vue'));

export const register = (app: App<Element>) => {
  app.component('EmployeeDetail', EmployeeDetail);
  app.component('MsConfigLayoutList', MsConfigLayoutList);
}