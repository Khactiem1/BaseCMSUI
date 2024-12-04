export default {
	/**
	 * Trạng thái của form
	 */
	FormState: {
		Add: 'Thêm',
		View: 'Xem',
		Edit: 'Sửa',
		Duplicate: 'Nhân bản',
		QuickAdd: 'Thêm nhanh',
	},
	FeatureRow: {
		Inactive: 'Ngừng sử dụng',
		Active: 'Sử dụng',
		Delete: 'Xoá',
	},
	ModelState: {
		None: 'None',
		Insert: 'Thêm',
		Update: 'Sửa',
		Delete: 'Xóa',
		Empty: 'Trống',
		Duplicate: 'Thêm',
	},
	/**
	 * Giới tính
	 */
	Gender: {
		Female: 'Nữ',
		Male: 'Nam',
		Other: 'Khác',
	},
	/**
	 * toán tử filter
	 */
	FilterOperator: {
		Contains: 'Chứa',
		Notcontains: 'Không chứa',
		StartsWith: 'Bắt đầu với',
		EndsWith: 'Kết thúc với',
		Null: '(Trống)',
		NotNull: '(Không trống)',
		Equals: 'Bằng',
		NotEquals: 'Khác',
		GreaterThan: 'Lớn hơn',
		GreaterThanEquals: 'Lớn hơn hoặc bằng',
		LessThan: 'Nhỏ hơn',
		LessThanEquals: 'Nhỏ hơn hoặc bằng',
	},
	Pagination: {
		// Two: '2 bản ghi trên 1 trang',
		Ten: '10 bản ghi trên trang',
		Twen: '20 bản ghi trên trang',
		Thir: '30 bản ghi trên trang',
		Fif: '50 bản ghi trên trang',
		Hunder: '100 bản ghi trên trang',
		RecordInPage: 'Bản ghi/Trang',
		Record: 'bản ghi',
		Prev: 'Trước',
		Next: 'Sau',
	},
	/**
	 * Enum dạng có không
	 */
	EnumYesNo:{
		Yes: "Có",
		No: "Không",
	},
	/**
	 * Enum Ngừng theo dõi
	 */
	EnumInactive: {
		Follow: 'Đang sử dụng',
		Unfollow: 'Ngừng sử dụng',
	},
	EnumInactiveUser: {
		Follow: 'Đang hoạt động',
		Unfollow: 'Ngừng hoạt động',
	},
	/**
	 * Enum Ngừng áp dụng
	 */
	EnumInactiveVoucher: {
		Follow: 'Đang áp dụng',
		Unfollow: 'Ngừng áp dụng',
	},
	/**
	 * Enum Ngừng áp dụng form lọc
	 */
	EnumInactiveVoucherFilter: {
		Follow: 'Đang áp dụng',
		Unfollow: 'Ngừng áp dụng',
		All: 'Tất cả',
	},
};
