/**
 * Định dạng dữ liệu hiển thị
 */
export const FormatType = {
	/**
	 * Loại mà không xử lý gì cả
	 */
	None: 0,
	/**
	 * Định dạng cho tiền hạch toán
	 * Đơn giá
	 */
	UnitPrice: 1,
	/**
	 * Thành tiền quy đổi
	 */
	Amount: 2,
	/**
	 * Hệ số, Tỷ lệ
	 */
	Rate: 3,
	/**
	 * Tỷ giá
	 */
	ExchangeRate: 4,
	/**
	 * Định dạng cho tiền ngoai te
	 * Đơn giá
	 */
	UnitPriceOC: 5,
	/**
	 * Thành tiền nguyên tệ
	 */
	AmountOC: 6,
	/**
	 * Hệ số, tỷ lệ phân bổ
	 */
	Allocation: 7,
	/**
	 * Số lượng chuyển đổi
	 */
	QuantityConvert: 8,
	/**
	 * Số lượng
	 */
	Quantity: 11,
	/**
	 * Kiểu chữ
	 */
	Text: 12,
	/**
	 * Kiểu tích chọn
	 */
	Checkbox: 13,
	/**
	 * Kiểu ngày tháng
	 */
	Date: 14,
	/**
	 * Kiểu danh sách
	 */
	List: 15,
	/**
	 * Kiểu thời gian
	 */
	Time: 16,
	/**
	 * Join mảng theo dấu ;
	 */
	Join: 17,
	/**
	 * Group Item
	 */
	GroupItem: 18,
	/**
	 * Kiểu ngày/tháng/năm có giờ
	 */
	DateTime: 19,
	/**
	 * Kiểu số không có định dạng sau dấu phẩy
	 */
	Number: 20,
	/**
	 * Kiểu text nhưng trên grid khi click vào sẽ drilldown
	 */
	Drilldown: 21,
	/**
	 * Dung lượng file
	 */
	FileSize: 24,
	/**
	 * Text nhiều dòng
	 */
	TextArea: 26,
	/**
	 * Định dạng dữ liệu html
	 */
	Html: 99,
	/**
	 * Kiểu enum
	 */
	Enum: 100,

	/**
	 * Kiểu trạng thái
	 */
	State: 101,
	/**
	 * Kiểu phần trăm
	 */
	Percentage: 102,
	/**
	 * Kiểu tỷ lệ
	 */
	Ratio: 27,
	/**
	 * Kiểu tiền quy đổi
	 */
	CurrencyExchange: 28,

	/**
	 * Kiểu đơn giá quy đổi
	 */
	UnitPriceConversion: 29,

	/**
	 * Kiểu combox Thuế
	 */
	VatTax: 30,

	/**
	 * Tỷ lệ thuế khác (Format kiểu number luôn có 2 chữ số sau phần thập phân)
	 */
	VatOther: 31,

	/**
	 * Kiểu thanh process
	 */
	Process: 103,
	/**
	 * Kiểu dạng hình ảnh
	 */
	Image: 104,
	/**
	 * Kiểu cột dòng số
	 */
	RowIndex: 105,

	/**
	 * Mã quy cách
	 */
	Serial: 106,
	/**
	 * Kiểu biểu đồ
	 */
	Chart: 107,
	/**
	 * Kiểu năm
	 */
	Year: 108
};
