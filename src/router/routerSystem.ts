const router: any [] = [
  {
    path: '/system/user',
    name: 'user',
    component: () => import('@/views/system/user/UserList.vue'),
    meta: { title: 'i18nUser.Title', sub_system_code: "user" }
  },
  {
    path: '/system/role',
    name: 'role',
    component: () => import('@/views/system/role/RoleList.vue'),
    meta: { title: 'i18nRole.Title', sub_system_code: "role" }
  },
  {
    path: '/system/menu',
    name: 'menu',
    component: () => import('@/views/system/menu/MenuList.vue'),
    meta: { title: 'i18nMenu.Title', sub_system_code: "menu" }
  },
]

export default router;