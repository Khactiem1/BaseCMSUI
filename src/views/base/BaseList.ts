import { mixinSuper } from '@/mixins/common/mixinSuper';
import { showAlert } from '@/commons/globalMessage';
import popupUtil from '@/commons/popupUtil';
import layoutAPI from '@/apis/dictionary/layoutAPI';
import memoryCache from '@/cache/memoryCache';

/**
 * Các thông tin chung của màn hình danh sách
 * Sử dụng chung cho danh sách và báo cáo động
 */
export default {
	mixins: [mixinSuper],
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
				pageSize: 20,

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
		};
	},
	created() {
		const me: any = this;
		const pageSizeCache = localStorage.getItem('pageSize');
		if(pageSizeCache){
			me.gridInfo.pageSize = Number(pageSizeCache);
		}
	},
	mounted() {
		const me: any = this;
		me.initLayout();
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
			//load dữ liệu lần đầu
			me.$nextTick(() => {
				me.loadData();
			});
		},

		/**
		 * Xử lý load dữ liệu
		 */
		async loadData(){
			const me: any = this;
			let param = {
				PageIndex: 1,
				PageSize: 20,
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

			// Xử lý paging
			param.PageSize = me.gridInfo.pageSize;
			param.PageIndex = me.gridInfo.pageIndex;

			// Xử lý build Filter
			param.Filter = me.buildFilterParam();
			param.Sort = me.buildSortFilter();
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
				me.loadData();
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
		async toggleActive(records: any [], value: boolean ){
			const me: any = this;
			let data = {
				ListID: records.map((_: any) => _[me.storeModule._config.field.key]),
				Inactive: value,
			};
			me.$ms.commonFn.mask();
			let res = await me.api.inactive(data);
			me.$ms.commonFn.unmask();
			if(res?.Success){
				records.forEach((_: any) => {
					_.inactive = value;
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
					initLayout: me.initLayout,
				}
				popupUtil.show('MsConfigLayoutList', param);
			}
		}

	},
};
