import { mixinSuper } from '@/mixins/common/mixinSuper';
import { permission } from '@/mixins/common/permission';
import { showAlert } from '@/commons/globalMessage';
import popupUtil from '@/commons/popupUtil';
import layoutAPI from '@/apis/dictionary/layoutAPI';
import memoryCache from '@/cache/memoryCache';
import moment from "moment";

/**
 * Các thông tin chung của màn hình danh sách
 * Sử dụng chung cho danh sách và báo cáo động
 */
export default {
	mixins: [mixinSuper, permission],
	data() {
		return {
			/**
			 * Store của module kế thừa base
			 */
			storeModule: {},

			/**
			 * api của module
			 */
			api: {},

			/**
			 * refname control hiển thị dữ liệu: grid/tree
			 */
			viewRef: 'viewList',
			/**
			 * binding ô tìm kiếm
			 */ 
			searchText: '',

			/**
			 * Điều kiện load tham số
			 */
			condition: {},
			/**
			 * có filter header không
			 */ 
			filterable: true,
			/**
			 * Mảng chứa text lọc
			 */
			lstRenderCondition: [],
			filterParam: {},
			gridInfo: {
				selected: [],
				/**
				 * Số lượng bản ghi trên 1 trang
				 */
				pageSize: 50,

				/**
				 * Page đang hiển thị
				 */
				pageIndex: 1,
			},
			/**
			 * Lưu một debounce id
			 */
			timeoutId: 0,

			/**
			 * Cấu hình layout Tag
			 */
			layoutTag: '',
			
			/**
			 * Cấu hình tên form detail
			 */
			formDetailName: '',

			/**
			 * Có lấy lên cột trạng thái hay ko
			 */
			isLoadActiveColumn: true,
		};
	},
	created() {
		const me: any = this;
		const pageSizeCache = localStorage.getItem('pageSize');
		if(pageSizeCache){
			me.gridInfo.pageSize = Number(pageSizeCache);
		}
	},
	async mounted() {
		const me: any = this;
		await me.initLayout();
		//load dữ liệu lần đầu
		me.$nextTick(() => {
			me.loadData();
		});
	},
	/**
	 * Xóa items trong grid khi unmount
	 */
	beforeUnmount() {

	},
	methods: {
		/**
		 * Xử lý cấu hình load layout cho grid
		 */
		async initLayout(layout: any = null) {
			const me: any = this;
			if (!(layout?.length)){
				layout = await me.getLayoutTemplate();
			}
			if (layout?.length) {
				layout = layout.filter((_: any) => _.visible);
				await me.customLayout(layout);
				me.applyLayout(layout);
			}
		},

		/**
		 * Xử lý load dữ liệu
		 */
		async loadData(){
			const me: any = this;
			let param = {
				PageIndex: 1,
				PageSize: 50,
				Columns: '',
				Filter: '',
				Sort: '',
				CustomParam: {},
			};
			await me.processParamLoadData(param);
			await me.customParamLoadData(param);
			await me.storeModule.load(param);
		},

		/**
		 * Xử lý custom tham số load data trước khi call lên serve lấy dữ liệu
		 */
		async customParamLoadData(param: any){

		},
		
		/**
		 * Xử lý param paging load dữ liệu
		 * @param param
		 */
		async processParamLoadData(param: any){
			const me: any = this;
			// Xử lý param colums truy vấn db
			if(me.$refs[me.viewRef] && me.$refs[me.viewRef].columnx?.length){
				param.Columns = me.$refs[me.viewRef].columnx.map((_: any) => _.dataField).join(',');
			}
			if(me.storeModule?._config?.field?.key){
				if(param.Columns){
					param.Columns = param.Columns.concat(`,${me.storeModule._config.field.key}`);
				}
				else{
					param.Columns = param.Columns.concat(`${me.storeModule._config.field.key}`);
				}
			}
			me.addColActiveParam(param);

			// Xử lý paging
			param.PageSize = me.gridInfo.pageSize;
			param.PageIndex = me.gridInfo.pageIndex;

			// Xử lý build Filter
			param.Filter = me.buildFilterParam();
			param.Sort = me.buildSortFilter();
		},

		/**
		 * Xử lý lấy thêm cột trạng thái mặc định sẽ lấy
		 */
		addColActiveParam(param: any){
			const me: any = this;
			if(!param.Columns) return;
			const columns: any [] = param.Columns.split(',');
			if(!columns.includes('is_active') && me.isLoadActiveColumn){
				param.Columns = param.Columns.concat(',is_active');
			}
		},

		/**
		 * Xử lý build tham số sort grid
		 */
		buildSortFilter(){
			const me: any = this;
			if(me.$refs[me.viewRef] && typeof me.$refs[me.viewRef].buildSortFilter === 'function'){
				const sort = me.$refs[me.viewRef].buildSortFilter();
				if(sort){
					return sort;
				}
			}
			return '';
		},

		/**
		 * Chuyển cơ chế search thành debounce 0.5s
		 * nktiem 20/05/2023
		 */
		debounceSearch(e: any, value: any) {
			const me: any = this;
			clearTimeout(me.timeoutId);
			me.timeoutId = setTimeout(() => {
				if(typeof me.$refs[me.viewRef]?.loadPageIndex === 'function'){
					me.$refs[me.viewRef].loadPageIndex(1);
				}
			}, 500);
		},

		/**
		 * Xử lý build filter ô tìm kiếm nhanh
		 */
		buildCustomFilter(){
			const me: any = this;
			let res: any [] = [];
			let searchTextTrim = me.searchText ? me.searchText.trim() : me.searchText;
			if (me.$refs[me.viewRef] && me.$refs[me.viewRef].columnx?.length && searchTextTrim) {
				me.$refs[me.viewRef].columnx.forEach((col: any) => {
					switch (col.formatType) {
						case me.$ms.constant.FormatType.Text:
							if (res.length > 0) {
								res.push('or');
							}
							res.push([col.dataField, 'contains', searchTextTrim]);
							break;
					}
				});
			}
			return res;
		},

		/**
		 * Xử lý build Filter
		 */
		buildFilterParam(){
			const me: any = this;
			const customFilter = me.buildCustomFilter();
			if(me.$refs[me.viewRef] && typeof me.$refs[me.viewRef].getFilterHeader === 'function'){
				const filter = me.$refs[me.viewRef].getFilterHeader();
				if(filter && filter.length){
					if(customFilter?.length){
						filter.push("and");
						filter.push(customFilter);
					}
					return JSON.stringify(filter);
				}
			}
			if(customFilter?.length){
				return JSON.stringify(customFilter);
			}
			return '';
		},

		/**
		 * Render mẫu
		 */
		async applyLayout(columns: any) {
			const me: any = this;
			if(me.$refs[me.viewRef] && typeof me.$refs[me.viewRef].initColumns === 'function'){
				me.$refs[me.viewRef].initColumns(columns);
			}
		},
	
		/**
		 * Custom lại layout
		 */
		async customLayout(layout: any){
	
		},
	
		/**
		 * Get bộ cấu hình layout grid về
		 */
		async getLayoutTemplate(){
			const me: any = this;
			if(me.layoutTag){
				let result = memoryCache.get(`Layout${me.layoutTag}`);
				if(result) return result;
				let res = await layoutAPI.getLayoutByTag(me.layoutTag);
				if(res?.Data?.config){
					result = JSON.parse(res.Data.config);
					memoryCache.set(`Layout${me.layoutTag}`, result);
					memoryCache.set(`Layout${me.layoutTag}Edit`, JSON.parse(JSON.stringify(result))); // Cache lại thêm cấu hình layout để tuỳ chỉnh giao diện ko liên quan đến grid
					return result;
				}
			}
			return null;
		},

		/**
		 * toggleActive bản ghi
		 * @param records danh sách bản ghi
		 * @param value giá trị update
		 */
		async toggleActive(records: any [], value: boolean){
			const me: any = this;
			const lstID = records.map((_: any) => _[me.storeModule._config.field.key]);
			let data = {
				ListID: lstID,
				Inactive: value,
			};
			me.$ms.commonFn.mask();
			let res = await me.api.inactive(data);
			me.$ms.commonFn.unmask();
			if(res?.Success){
				me.storeModule.items.forEach((row: any) => {
					if(lstID.includes(row[me.storeModule._config.field.key])){
						row.is_active = value;
					}
				});
			}
		},

		/**
		 * Xoá một bản ghi trên danh sách
		 * @param record 
		 */
		async deleteRow(record: any){
			const me: any = this;
			const result = await showAlert(me.$t('i18nCommon.AskDeleteRecord'));
			if(result){
				me.$ms.commonFn.mask();
				let res = await me.storeModule.delete(record);
				me.$ms.commonFn.unmask();
				if (res?.Success){
					if(!me.storeModule.items.length){
						if(typeof me.$refs[me.viewRef]?.loadPageIndex === 'function'){
							me.$refs[me.viewRef].loadPageIndex(1);
						}
					}
					me.$ms.commonFn.pushNotification({
						type: me.$ms.constant.ENotificationType.Success,
						message: me.$t('i18nCommon.crud.delete_success'),
					});
				}
			}
		},

		/**
		 * Xoá nhiều bản ghi 1 lúc
		 * @author nktiem 05.12.2024
		 */
		async deleteMultiple(){
			const me: any = this;
			const result = await showAlert(me.$t('i18nCommon.AskDeleteRecord'));
			if(result){
				const lstID: any [] = me.gridInfo.selected.map((_: any) => _[me.storeModule._config.field.key]);
				me.$ms.commonFn.mask();
				let res = await me.api.deleteMultiple(lstID);
				me.$ms.commonFn.unmask();
				if (res?.Success){
					lstID.forEach((_: any) => {
						let idxRemove = me.storeModule.items.findIndex((row: any) => row[me.storeModule._config.field.key] === _);
						if (idxRemove !== -1){
							me.storeModule.items.splice(idxRemove, 1);
							me.storeModule.total -= 1;
						}
					});
					me.gridInfo.selected = [];
					if(!me.storeModule.items.length){
						if(typeof me.$refs[me.viewRef]?.loadPageIndex === 'function'){
							me.$refs[me.viewRef].loadPageIndex(1);
						}
					}
					me.$ms.commonFn.pushNotification({
						type: me.$ms.constant.ENotificationType.Success,
						message: me.$t('i18nCommon.crud.delete_success'),
					});
				}
			}
		},

		/**
		 * Mở form sửa một bản ghi
		 * @param record
		 */
		async edit(record: any){
			const me: any = this;
			if(me.subSystemCode && !me.checkActionPermission("Edit")){
				return;
			}
			me.$ms.commonFn.mask();
			let payload = { id: record[me.storeModule._config.field.key] }
			let res = await me.api.getEdit(payload);
			me.$ms.commonFn.unmask();
			if (res?.Success){
				let param = {
					formState: me.$ms.constant.FormState.Edit,
					dataRow: res.Data,
				}
				popupUtil.show(me.formDetailName, param);
			}
		},

		/**
		 * Nhân bản
		 * @param record 
		 */
		async duplicate(record: any){
			const me: any = this;
			me.$ms.commonFn.mask();
			let payload = { id: record[me.storeModule._config.field.key] }
			let res = await me.api.getEdit(payload);
			me.$ms.commonFn.unmask();
			if (res?.Success){
				let param = {
					formState: me.$ms.constant.FormState.Add,
					dataRow: res.Data,
				}
				popupUtil.show(me.formDetailName, param);
			}
		},

		/**
		 * Thêm mới
		 */
		async add(){
			const me: any = this;
			let param = {
				formState: me.$ms.constant.FormState.Add,
				dataRow: {},
			}
			popupUtil.show(me.formDetailName, param);
		},

		/**
		 * Mở form tuỳ chỉnh giao diện
		 */
		configLayout(){
			const me: any = this;
			let columns = memoryCache.get(`Layout${me.layoutTag}Edit`);
			if(columns?.length){
				let param = {
					columns: JSON.parse(JSON.stringify(columns)),
					layoutTag: me.layoutTag,
					initLayout: async (columns: any []) => {
						await me.initLayout(columns);
						me.$nextTick(() => {
							me.loadData();
						});
					},
				}
				popupUtil.show('MsConfigLayoutList', param);
			}
		},
		
		/**
		 * Xuất khẩu dữ liệu ra excel
		 */
		async exportData(){
			const me: any = this;
			let exportDataParam = {
				SheetName: "",
				Title: "",
				HeaderColumns: [] as any [],
				Param: {
					PageIndex: 0,
					PageSize: 0,
					Columns: '',
					Filter: '',
					Sort: '',
					CustomParam: {},
				},
			};
			await me.processParamLoadData(exportDataParam.Param);
			await me.customParamLoadData(exportDataParam.Param);
			exportDataParam.Param.PageIndex = 0;
			exportDataParam.Param.PageSize = 0;
			let title = me.$el.querySelector('.name-table h1');
			if(title?.innerText){
				exportDataParam.Title = title.innerText;
				exportDataParam.SheetName = title.innerText;
			}
			if(me.$refs[me.viewRef] && typeof me.$refs[me.viewRef].columnx?.length){
				me.$refs[me.viewRef].columnx.forEach((col: any) => {
					exportDataParam.HeaderColumns.push({
						DataField: col.dataField,
						FormatType: Number(col.formatType),
						Header: col.headerCustom && col.headerCustom.trim() !== '' ? col.headerCustom : me.$t(col.header),
						Width: Number(col.width),
						EnumResources: col.formatType == me.$ms.constant.FormatType.Enum ? me.$ms.commonFn.getEnumSource(col.enum) : null,
					});
				});
				me.$ms.commonFn.mask();
				let res = await me.api.exportData(exportDataParam);
				me.$ms.commonFn.unmask();
				if(res){
					const url = window.URL.createObjectURL(res); // Tạo URL từ Blob
					const link = document.createElement('a'); // Tạo thẻ <a> để tải file
					link.href = url;
					link.download = `${exportDataParam.SheetName}_${moment(new Date).format('DD/MM/YYYY')}.xlsx`; // Đặt tên file (có thể động)
					link.click(); // Kích hoạt tải xuống
					window.URL.revokeObjectURL(url); // Giải phóng bộ nhớ
				}
			}
		},

	},
};
