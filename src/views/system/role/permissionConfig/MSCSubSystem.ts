export const mscSubSystemList = [
  //#region Danh mục
	{
		sort_order: 1000,
		sub_system_code: 'Dictionary',
		sub_system_name: 'Dictionary',
		parent_sub_system_code: null,
		sub_system_serial: '/ROOT/Dictionary/',
	},
	{
		sort_order: 1100,
		sub_system_code: 'Object',
		sub_system_name: 'Dictionary',
		parent_sub_system_code: 'Dictionary',
		sub_system_serial: '/ROOT/Dictionary/Object',
	},
	{
		sort_order: 1105,
		sub_system_code: 'Employee', // Quản lý nhân viên
		sub_system_name: 'Employee',
		parent_sub_system_code: 'Object',
		sub_system_serial: '/ROOT/Dictionary/Object/Employee',
		list_permission: '{"View": false, "Add": false, "Edit": false, "Delete": false, "ShowColumns": false}',
	},
	//#endregion

	//#region Hệ thống
	{
		sort_order: 3000,
		sub_system_code: 'System',
		sub_system_name: 'System',
		parent_sub_system_code: null,
		sub_system_serial: '/ROOT/System/',
	},
	{
		sort_order: 3100,
		sub_system_code: 'Decentralization',
		sub_system_name: 'System',
		parent_sub_system_code: 'System',
		sub_system_serial: '/ROOT/System/Decentralization',
	},
	{
		sort_order: 3105,
		sub_system_code: 'User', // Quản lý người dùng
		sub_system_name: 'User',
		parent_sub_system_code: 'Decentralization',
		sub_system_serial: '/ROOT/System/Decentralization/User',
		list_permission: '{"View": false, "Add": false, "Edit": false, "Delete": false, "ShowColumns": false}',
	},
  {
		sort_order: 3110,
		sub_system_code: 'Role', // Quản lý phân quyền
		sub_system_name: 'Role',
		parent_sub_system_code: 'Decentralization',
		sub_system_serial: '/ROOT/System/Decentralization/Role',
		list_permission: '{"View": false, "Add": false, "Edit": false, "Delete": false, "ShowColumns": false}',
	},
	//#endregion
];