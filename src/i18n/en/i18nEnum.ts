export default {
	/**
	 * Trạng thái của form
	 */
	FormState: {
		Add: 'Add',
		View: 'View',
		Edit: 'Edit',
		Duplicate: 'Duplicate',
		QuickAdd: 'Quick Add',
	},
	FeatureRow: {
		Inactive: 'Inactive',
		Active: 'Active',
		Delete: 'Delete',
	},
	ModelState: {
		None: 'None',
		Insert: 'Insert',
		Update: 'Update',
		Delete: 'Delete',
		Empty: 'Empty',
		Duplicate: 'Duplicate',
	},
	/**
	 * Giới tính
	 */
	Gender: {
		Female: 'Female',
		Male: 'Male',
		Other: 'Other',
	},
	/**
	 * toán tử filter
	 */
	FilterOperator: {
		Contains: 'Contains',
		Notcontains: 'Not contains',
		StartsWith: 'Starts with',
		EndsWith: 'Ends with',
		Null: '(Null)',
		NotNull: '(Not null)',
		Equals: 'Equals',
		NotEquals: 'Not equals',
		GreaterThan: 'Greater than',
		GreaterThanEquals: 'Greater than equals',
		LessThan: 'Less than',
		LessThanEquals: 'Less than equals',
	},
	Pagination: {
		Ten: '10 record in page',
		Twen: '20 record in page',
		Thir: '30 record in page',
		Fif: '50 record in page',
		Hunder: '100 record in page',
		RecordInPage: 'Record/Page',
		Record: 'Record',
		Prev: 'Prev',
		Next: 'Next',
	},
	/**
	 * Enum dạng có không
	 */
	EnumYesNo:{
		Yes: "Yes",
		No: "No",
	},
	/**
	 * Enum Ngừng theo dõi
	 */
	EnumInactive: {
		Follow: 'Follow',
		Unfollow: 'Unfollow',
	},
	EnumInactiveUser: {
		Follow: 'Follow',
		Unfollow: 'Unfollow',
	},
	/**
	 * Enum Ngừng áp dụng
	 */
	EnumInactiveVoucher: {
		Follow: 'Follow',
		Unfollow: 'Unfollow',
	},
	/**
	 * Enum Ngừng áp dụng form lọc
	 */
	EnumInactiveVoucherFilter: {
		Follow: 'Follow',
		Unfollow: 'Unfollow',
		All: 'All',
	},
};
