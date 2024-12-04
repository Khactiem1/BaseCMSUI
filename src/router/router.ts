import { createRouter, createWebHistory } from 'vue-router'
import i18n from '@/i18n/i18n';
import routerDictionary from '@/router/routerDictionary';
import routerBusiness from '@/router/routerBusiness';

const main: any [] = [
  {
    path: '/',
    component: () => import('@/page/MainPage.vue'),
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/HomeDashboard.vue'),
      },
      {
        path: '/not-found',
        name: 'notFound',
        component: () => import('@/page/NotFound.vue'),
      },
      {
        path: '/demoControl',
        name: 'demoControl',
        component: () => import('@/views/demo/DemoControl.vue'),
      },
      ...routerDictionary,
      ...routerBusiness,
    ],
  },
  {
    path: '/login',
    component: () => import('@/page/LoginPage.vue'),
    meta: { title: 'page.login' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/not-found'
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: main,
  linkActiveClass: "active",
})

router.beforeEach((to: any, from: any, next: any) => {
  document.title = i18n.global.t(to.meta.title ? to.meta.title : 'i18nCommon.TitleDefault') // Đặt tiêu đề trang theo ngôn ngữ hiện tại
  if (to.path == '/'){
    next({ name: "dashboard" });
  }
  next();
})

export default router;
