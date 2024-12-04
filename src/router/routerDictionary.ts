const router: any [] = [
  {
    path: '/ditionary/employee',
    name: 'employee',
    component: () => import('@/views/dictionary/employee/EmployeeList.vue'),
    meta: { title: 'i18nEmployee.Title', subSystemCode: "" }
  },
]

export default router;