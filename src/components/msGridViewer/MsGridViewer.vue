<template>
  <div class="table-content">
    <div class="table-scroll">
      <div class="table-container">
        <table class="table">
          <thead class="thead-light">
            <!-- Phần head table -->
            <tr>
              <!-- ô check box -->
              <th class="fix" style="width: 40px;" v-if="multiple">
                <ms-checkbox 
                  :checked="isCheckedAll" 
                  @custom-handle-click-checkbox="changeCheckedMultiple"
                >
                </ms-checkbox>
              </th>
              <draggable
                :list="columnx"
                :disabled="!true"
                item-key="dataField"
                :tag="'div'"
                class="drag"
                ghost-class="ghost"
                @start="dragging = true"
                @end="dragging = false"
              >
                <!-- Phần render các cột head -->
                <!-- 'left': `${BaseComponent.columnFix[index] ? `${BaseComponent.columnFix[index].width}px` : ''}` -->
                <template #item="{ element, index }">
                  <th 
                    :class="`${index === columnx.length - 1 ? 'header-content-end' : ''} ${ element.formatType === $ms.constant.FormatType.Number ? 'right' : '' }`" 
                    :style="
                    { 'min-width': `${element.width}px`, 
                      'width': `${element.width}px`, 
                      'max-width': `${element.width}px`, 
                    }"
                  >
                    <span style="display: flex; line-height: 32px" :class="``" @click="handleSetSortColumn(element)">
                      <span style="flex: 1; display: inline-block;">{{ element.headerCustom && element.headerCustom.trim() !== '' ? element.headerCustom : $t(`${element.header}`) }}</span>
                      <div 
                        v-if="element.sort"
                        class="sort" 
                        :class="{ 'sortASC': element.sort === 'ASC' }">
                      </div>
                    </span>
                    <div 
                      v-if="filterable" @click="handleShowFilter($event, element)" class="mi-header-option"></div>
                  </th>
                </template>
              </draggable>
              <!-- Phần render các chức năng tác vụ -->
              <th style="width: 120px; min-width: 120px" class="text-center fix column-end">
                {{ $t('i18nCommon.function') }}
              </th>
            </tr>
          </thead>
          <!-- Phần render loader table khi tải dữ liệu -->
          <ms-grid-loader v-if="loading" :columns="columnx" :lengthList="data.length" ></ms-grid-loader>
          <!-- Phần render báo table trống khi danh sách trống -->
          <ms-grid-empty v-if="!loading && data.length === 0" ></ms-grid-empty>
          <tbody v-if="!loading">
            <!-- Phần body table -->
            <tr v-for="(row, index) in data"
              :key="idField ? row[idField] : index"
              @dblclick="handleDoubleClickRow(row)"
              @click="handleClickRow(row)"
              :class="[`${row.selected ? 'row-selected' : ''}`]"
            >
              <!-- ô check box -->
              <td v-if="multiple" class="column-sticky">
                <ms-checkbox 
                  :checked="isSelected(row)"
                  @custom-handle-click-checkbox="handleClickCheckbox(row)"
                ></ms-checkbox>
              </td>
              <!-- Phần render các cột nội dung của table -->
              <!-- :style="{ 'left': `${BaseComponent.columnFix[index] ? `${BaseComponent.columnFix[index].Width}px` : ''}`, 'position': `${BaseComponent.columnFix[index] ? `sticky` : 'unset'}`}"  -->
              <!-- ${BaseComponent.columnFix[index] ? `z3`: ``}  -->
              <!-- @dblclick=" handleClickActionColumTable(BaseComponent.actionTable.actionDefault, row[BaseComponent.actionTable.fieldId])" -->
              <td 
                v-for="(col, index) in columnx" 
                :title="$ms.commonFn.processDataaGridViewer(col, row[col.dataField])"
                :class="`${index === columnx.length - 1 ? 'header-content-end':''} ${ col.formatType === $ms.constant.FormatType.Number ? 'right' : '' }`"
                :key="index" 
              >
                <slot v-if="col.type === 'custom'" :name="col.dataField" :record="row" />
                <span v-else class="data-table-bind" :class="`${lineClamp}`">
                  {{ $ms.commonFn.processDataaGridViewer(col, row[col.dataField]) }}
                </span>
                <!-- <div v-if="col.TypeFormat.IsImage === true" class="image-table">
                  <img v-bind:src="row[col.dataField] ? row[col.dataField].includes('/Images/') ? environment.IMAGE_API + row[col.dataField] : '' + row[col.dataField] : ''" alt="">
                </div> -->
                <!-- <div v-if="col.TypeFormat.CheckBox === true" class="checkBox">
                  <ms-checkbox :checked="row[col.dataField]" :lockCheckBox="col.TypeFormat.LockCheckBox"> </ms-checkbox>
                </div> -->
              </td>
              <!-- Phần render các chức năng tác vụ -->
              <td class="text-center fix column-end">
                <div class="action-colum_table">
										<slot name="widget-body" :record="row" />
                </div>
              </td>
            </tr>
          </tbody>
          <!-- Render phần tính tổng -->
          <!-- <thead v-if="BaseComponent.showTotalColumn && data.length !== 0" class="thead-light table-footer">
            <tr>
              <th class="fix" style="text-transform: none; border-right: none;" v-if="BaseComponent.checkShowActionSeries">
                {{ $t('common.sum') }}
              </th>
              <th v-for="(item, index) in BaseComponent.columns" style="text-align: right; border-right: none;"
                :class="`${BaseComponent.columnFix[index] ? `z3`: ``}`"
                :style="{ 'min-width': `${item.Width}px`, width: `${item.Width}px`, 'left': `${BaseComponent.columnFix[index] ? `${BaseComponent.columnFix[index].Width}px` : ''}`}"
                :key="item.Field"
              >
                {{ item.Data ?  Base.Comma(item.Data) : "" }}
              </th>
              <th style="width: 120px; min-width: 120px; border-right: none;" class="text-center fix z3">
              </th>
            </tr>
          </thead> -->

          <!-- Phần render các chức năng tác vụ (khi click vào ô show tác vụ thì sẽ hiển thị)-->
          <teleport to="#app">
            <ms-grid-filter
              v-click-outside="() => handleShowFilter()"
              :handleFixColumn="handleFixColumn" 
              :handleShowFilter="handleShowFilter" 
              :col="colFilter"
              :setPositionFilter="setPositionFilter"
              v-if="isShowFilter"
            >
            </ms-grid-filter>
          </teleport>
        </table>
      </div>
    </div>
    <!-- Phần phân trang -->
    <div v-if="data.length !== 0 && pageTotal" class="paging-container sticky">
      <div class="total-record">
        {{ $t('i18nCommon.total') }}: <strong>{{ pageTotal }}</strong> {{ $t('i18nCommon.record') }}
        <span 
          v-if="multiple && gridInfo.selected?.length"
        > 
          - 
          <span style="color: var(--primary__color);">{{ $t('i18nControl.MsGridViewer.selected') }}:</span>
          <strong style="padding: 0 4px;">{{ gridInfo.selected.length }}</strong>
          <span style="color: var(--primary__color);">{{ $t('i18nCommon.record') }}</span>
          -
          <span @click="removeSelectedAll" class="remove-selected-all">{{ $t('i18nControl.MsGridViewer.removeSelectedAll') }}</span>
        </span>
      </div>
      <div v-if="pagination" class="paging">
        <ms-combobox
          :data="[
            { value: 10, header: $t('i18nEnum.Pagination.Ten') },
            { value: 20, header: $t('i18nEnum.Pagination.Twen') },
            { value: 30, header: $t('i18nEnum.Pagination.Thir') },
            { value: 50, header: $t('i18nEnum.Pagination.Fif') },
            { value: 100, header: $t('i18nEnum.Pagination.Hunder') },
          ]"
          :disabled="true"
          :value="'value'"
          :header="'header'"
          :noAnimation="true"
          :autoPosition="true"
          v-model="currentPage"
        ></ms-combobox>
        <ms-pagination
          :pageSize="gridInfo.pageSize"
          :pageTotal="pageTotal"
          :pageIndex="gridInfo.pageIndex"
          @load-page-index="loadPageIndex"
        ></ms-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import MsPagination from "./MsPagination.vue";
import MsGridEmpty from "./MsGridEmpty.vue";
import MsGridLoader from "./MsGridLoader.vue";
import MsGridFilter from "./MsGridFilter.vue";
import { watch, ref, getCurrentInstance, computed, defineComponent } from "vue";
import draggable from "vuedraggable";
import moment from "moment";

export default defineComponent({
  components: {
    MsPagination,
    MsGridEmpty,
    MsGridLoader,
    MsGridFilter,
    draggable
  },
  props: {
    /**
     * Dữ liệu đang binding
     */
    data: {
      type: Array,
      default: [],
    },

    /**
     * Tổng số bản ghi
     */
    pageTotal: {
      type: Number,
      default: 0,
    },

    /**
     * Số bản ghi / 1 trang
     */
    gridInfo: {
      type: Object,
      default: {
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
    },

    /**
		 * Các thuộc tính trong columns
		 * @params lock: Có đang cố định cột.
		 * @params width: độ rộng của cột
		 * @params header: Tiêu đề của cột
		 * @params dataField: Trường dữ liệu
		 * @params type: Kiểu trường type custom
		 * @params formatType: Kiểu dữ liệu
		 * @params headerCustom: Tiêu đề của cột custom bởi người dùng
		 * @params visible: Có show cột này hay không
		 */
    columns: {
			type: Array,
			default: [],
		},

    /**
     * Trạng thái loading Page
     */
    loading: {
      type: Boolean,
      default: false,
    },

    /**
     * ID của bản ghi (dùng để làm key)
     */
    idField: {
      type: String,
      default: '',
    },

    /**
     * Có check all hay không
     */
    multiple: {
      type: Boolean,
      default: true,
    },

    /**
     * Có filter table không
     */
    filterable: {
      type: Boolean,
      default: true,
    },

    /**
     * Có paging hay không
     */
    pagination: {
      type: Boolean,
      default: true,
    },

    /**
     * Số dòng hiển thị dữ liệu trên 1 row
     */
    lineClamp: {
      type: String,
      default: 'hidden-space_1',
    },

    /**
     * Hàm load data filter
     */
    loadData: {
      type: Function,
      default: () => {}
    },
  },
  setup() {
    const { proxy }: any = getCurrentInstance();

    const colFilter = ref({}); // Dữ liệu cột đang thực hiện show filter

    /** 
     * Hàm xử lý checkbox value true thì là check ô tất cả check, value là 0,1,2 là xử lý các phần tử được check
     * Khắc Tiềm - 08.03.2023 
     * */
    const handleClickCheckbox = (row: any) => {
      const me: any = proxy;
      const indexRowSelected = me.gridInfo.selected.findIndex((item: any) => item[me.idField] == row[me.idField]);
      if (indexRowSelected !== -1){
        me.gridInfo.selected.splice(indexRowSelected, 1);
      }
      else{
        me.gridInfo.selected.push(row);
      }
    }

    /**
		 * Kiểm tra xem cột được check hay không ?
		 * duyệt trong data nếu có chưa dữ liệu của dòng tương ứng thì return true ngược lại false
		 * @param dataRow dữ liệu của dòng được check
		 *  */
		const isSelected = (dataRow: any) => {
			const me: any = proxy;
			if (me.gridInfo.selected && me.gridInfo.selected.length > 0) {
				return me.gridInfo.selected.findIndex((x: any) => x[me.idField] === dataRow[me.idField]) === -1 ? false : true;
			}
			return false;
		};

    
    /**
     * Ẩn hiện check tất cả
     * Khắc Tiềm - 15.09.2022
     */
    const isCheckedAll = computed(()=> {
      const me: any = proxy;
      if(me.idField && me.multiple && me.data && me.gridInfo.selected){
        const lstDataxID: any [] = me.data.map((_: any) => _[me.idField]);
        const countDataSelectInDatax = me.gridInfo.selected.filter((_: any) => lstDataxID.includes(_[me.idField]));
        if(countDataSelectInDatax?.length && countDataSelectInDatax.length === lstDataxID.length){
          return true;
        }
        return false;
      }
    });

    /**
     * Bỏ chọn tất cả các bản ghi đang selected
     */
    const removeSelectedAll = () => {
      const me: any = proxy;
      me.gridInfo.selected = [];
    };

    /**
     * Xử lý check all hoặc bỏ check all toàn bộ rowData
     */
    const changeCheckedMultiple = () => {
      const me: any = proxy;
      if(isCheckedAll.value){
        me.data.forEach((row: any) => {
          const indexSelectRow = me.gridInfo.selected.findIndex((_: any) => _[me.idField] == row[me.idField]);
          if (indexSelectRow !== -1){
            me.gridInfo.selected.splice(indexSelectRow, 1);
          }
        });
      }
      else{
        me.data.forEach((row: any) => {
          if (!me.gridInfo.selected.find((_: any) => _[me.idField] == row[me.idField])){
            me.gridInfo.selected.push(row);
          }
        });
      }
    };

    const dragging = ref(false);

    /** Column lấy từ props */
    const columnx: any = ref(JSON.parse(JSON.stringify(proxy.columns)));

    /**
     * initColumns từ base
     * @param columns
     */
    const initColumns = (columns: any []) => {
      columnx.value = columns;
    };

    /**
     * Xử lick DoubleClickRow
     */
    const handleDoubleClickRow = (row: any) => {
      const me: any = proxy;
      me.$emit('handleDoubleClickRow', row);
    };

    /**
     * Xử lý click row
     */
    const handleClickRow = (row: any) => {
      const me: any = proxy;
      me.data.forEach((rowData: any) => {
        delete rowData.selected;
      });
      row.selected = true;
    };

    /** Kiểm tra sắp xếp lại cột khi kéo thả */
    // watch(dragging,(newVal)=> {
    //   if(newVal === false){
    //     setupColumns();
    //   }
    // })

    /**
     * Hàm fix column khi người dùng kéo những column bị fix
     * Khắc Tiềm - 08.03.2023
     */
    // const setupColumns = async () => {
    //   const me: any = proxy;
    //   const columns: any [] = JSON.parse(JSON.stringify(me.columns));
    //   await columns.sort((a: any, b: any) => (a.FixColumn === b.FixColumn) ? 0 : a.FixColumn ? -1 : 1);
    //   // this.store.dispatch(`${this.Module}/setColumnAction`, columns);
    // }

    /** Kiểm tra sự thay đổi từ Base, nếu thay đổi thì tiến hành update */
    // const refColumn: any = computed(() => proxy.columns);
    // watch(refColumn, () => {
    //   columnx.value = proxy.columns;
    // })

    /**
    * hàm lưu số lượng bản ghi muốn hiển thị vào local
    * Khắc Tiềm - 08.03.2023
    */
    const setPageSize = async (record: number) => {
      const me: any = proxy;
      me.gridInfo.pageIndex = 1;
      me.gridInfo.pageSize = record;
      localStorage.setItem('pageSize', `${record}`);
      me.loadData();
    }

    /**
     * Chuyển trang
     */
    const loadPageIndex = (value: any) => {
      const me: any = proxy;
      me.gridInfo.pageIndex = value;
      me.loadData();
    };
    
    /**
     * SL bản ghi trên 1 trang đang v-model combobox
     */
    const currentPage = ref(proxy.gridInfo.pageSize);

    watch(currentPage, (newValue) => {
      setPageSize(newValue);
    });
    /**
     * Trạng thái hiển thị ô lọc
     */
    const isShowFilter: any = ref(false);

    /**
     * Set vị trị của form filter
     */
    const setPositionFilter: any = ref({ top: 0, left: 0});

    const handleFixColumn = () => {

    };
    
    /**
     * 
     * Hàm đóng mở form tìm kiếm
     */
    const handleShowFilter = async (event: any = null, col: any = null, isRelaodFilter = false) => {
      const me: any = proxy;
      try {
        if(event){
          const rect = event.srcElement.getBoundingClientRect()
          setPositionFilter.value.top = rect.top + 25;
          setPositionFilter.value.left = rect.left - (346 - rect.width);
        }
        if(!isShowFilter.value && col){
          colFilter.value = col;
        }
        isShowFilter.value = !isShowFilter.value;
        if(isRelaodFilter){
          me.gridInfo.pageIndex = 1;
          me.loadData();
        }
      } catch (e) {
        console.log(e);
      }
    }

    /**
     * Hàm xử lý sắp xếp
     */
    const handleSetSortColumn = async (col: any) => {
      const me: any = proxy;
      if(!col.sort){
        col.sort = 'DESC';
      }
      else if (col.sort == 'DESC'){
        col.sort = 'ASC';
      }
      else {
        delete col.sort;
      }
      me.loadData();
    }

    /**
		 * Xử lý build tham số sort grid
		 */
    const buildSortFilter = () => {
      let me: any = proxy,
        result: any [] = [],
        columns: any [] = me.columnx.filter((_: any) => _.sort); //me.columnx;
      columns.forEach((col: any) => {
        result.push(`${col.dataField} ${col.sort}`);
      });
      return result.join(',');
    }

    /**
		 * Đọc điều kiện filter header
		 */
		const getFilterHeader = (hasColumn = false) => {
			let me: any = proxy,
				result: any [] = [],
				enumFilterHeader: any = me.$ms.constant.FilterOperator,
				columns: any = me.columnx.filter((_: any) => _.filter); //me.columnx;
      
			for (let i = 0; i < columns.length; i++) {
				let column = columns[i];
				if (column.filter && column.filter.value !== column.filterIgnoreValue) {
					let item: any = null,
						filterValue: any = column.filter.value,
						operator: any = column.filter.operator;
					// ldlong: Check trước khi xử lý chuỗi (do filterValue có thể là dạng số trường hợp cột Enum)
					if (filterValue && typeof filterValue == 'string') {
						filterValue = filterValue.replaceAll('\\', '\\\\\\\\').replaceAll('%', '\\%').trim();
					}
					switch (operator) {
						case enumFilterHeader.Between:
							item = [
								{
									field: column.dataField,
									operator: enumFilterHeader.GreaterThanEquals,
									value: column.filter.from,
								},
								{
									field: column.dataField,
									operator: me.$ms.constant.FilterHeader.LessThanEquals,
									value: column.filter.to,
								},
							];
							break;
						case enumFilterHeader.Null:
						case enumFilterHeader.NotNull:
							item = {
								field: column.dataField,
								operator: operator,
							};

							//với cột text sẽ fix giá trị để lên server sẽ xử lý thêm kiểm tra với giá trị trống ''
							switch (column.formatType) {
								case me.$ms.constant.FormatType.Text:
									item.value = 'text';
									break;
							}
							break;
						case enumFilterHeader.Contains:
						case enumFilterHeader.Notcontains:
						case enumFilterHeader.StartsWith:
						case enumFilterHeader.EndsWith:
							if (typeof filterValue !== 'undefined' && filterValue !== null && filterValue !== '') {
								item = {
									field: column.dataField,
									operator: operator,
									value: filterValue,
								};
							}
							break;
						default:
							switch (column.formatType) {
								case me.$ms.constant.FormatType.Date:
									if (filterValue) {
										item = {
											field: column.dataField,
											value: moment(filterValue), //moment(filterValue).format('YYYY-MM-DD'),
											operator: operator,
										};
									}
									break;
								// case 'ColumnBoolean':
								// 	let valueFilter = filterValue, operatorFilter = operator;
								// 	if(filterValue === 0){ // Nếu lọc kiểu chưa tích thì lấy ra những thằng khác với thằng đã tích vì có trường hơp không chọn trường mở rộng thì lưu nó là null
								// 		valueFilter = 1;
								// 		operatorFilter = '<>';
								// 	}
								// 	item = {
								// 			field: column.dataField,
								// 			value: valueFilter,
								// 			operator: operatorFilter,
								// 		};
								// 	break;
								default:
									if (typeof filterValue !== 'undefined' && filterValue !== null) {
										item = {
											field: column.dataField,
											value: filterValue,
											operator: operator,
										};
									}
									break;
							}
							break;
					}

					//xử lý tình huống enum của cột không chứa giá trị thì khỏi filter
					if (item && (column.enumName || column.enum) && !Array.isArray(item)) {
						let enumObj = me.$ms.constant[column.enumName || column.enum],
							hasValue = false;
						for (let i in enumObj) {
							if (enumObj[i] === item.value) {
								hasValue = true;
								break;
							}
						}
						if (!hasValue) {
							item = null;
						}
					}

					if (item) {
						//Thêm xử lý lại đoạn Between
						if (Array.isArray(item)) {
							for (let i = 0; i < item.length; i++) {
								const data = item[i];
								if (hasColumn) {
									data.column = column;
								}
								if (column.nullToFail) {
									data.nullToFail = column.nullToFail;
								}
								if (result.length > 0) {
									result.push('and');
								}
								result.push([data.field, data.operator, data.value]);
							}
						} else {
							if (hasColumn) {
								item.column = column;
							}
							if (column.nullToFail) {
								item.nullToFail = column.nullToFail;
							}
							if (result.length > 0) {
								result.push('and');
							}
							if(column.formatType == me.$ms.constant.FormatType.Text){
								if (item.operator == enumFilterHeader.Null) {
									let condition = [];
									condition.push([item.field, item.operator, item.value]);
									condition.push('or');
									condition.push([item.field, '=', '']);
									result.push(condition);
								} else if (item.operator == enumFilterHeader.NotNull) {
									let condition = [];
									condition.push([item.field, item.operator, item.value]);
									condition.push('and');
									condition.push([item.field, '<>', '']);
									result.push(condition);
								}
								else {
									result.push([item.field, item.operator, item.value]);
								}
							}
							else {
								result.push([item.field, item.operator, item.value]);
							}
						}
					}
				}
			}

			if (me.customFilter) {
				if (Array.isArray(me.customFilter)) {
					result = result.concat(me.customFilter);
				}

				/** Custom lọc grid */
				if (typeof me.customFilter == 'function') {
					result = me.customFilter(result);
				}
			}
			return result;
		};

    return {
      colFilter,
      currentPage,
      columnx,
      dragging,
      isCheckedAll,
      isShowFilter,
      setPositionFilter,
      isSelected,
      loadPageIndex,
      handleSetSortColumn,
      handleShowFilter,
      buildSortFilter,
      getFilterHeader,
      changeCheckedMultiple,
      handleClickCheckbox,
      initColumns,
      handleFixColumn,
      handleDoubleClickRow,
      handleClickRow,
      removeSelectedAll,
    };
  },
});
</script>

<style lang="scss" scoped>
::-webkit-scrollbar-thumb {
  border-radius: 0;
  background: #b0b0b0;
}
::-webkit-scrollbar-thumb:hover {
  border-radius: 0;
  background: #808080;
}
::-webkit-scrollbar {
  height: 10px; /* height of horizontal scrollbar ← You're missing this */
  width: 8px;
	background-color: var(--while__color);
}
::-webkit-scrollbar-track {
  border-radius: 0;
  margin-bottom: 55px;
  margin-top: 34px;
  direction: rtl;
  margin-left: 16px;
  margin-right: 15px;
}
.table-content {
  position: relative;
  overflow: auto;
  scroll-behavior: smooth;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--while__color);
}
table {
  border-spacing: 0;
  width: 100%;
  background-color: var(--while__color);
}
.drag{
  display: contents;
}
.table .thead-light th {
  border-right: 1px solid #c7c7c7;
  border-bottom: 1px solid #c7c7c7;
  min-height: 33px;
  padding: 0 10px 0 10px;
  font-size: 12px;
  font-family: 'notosans-semibold';
  height: 34px;
  position: sticky;
  top: 0;
  background-color: #e5e8ec;
  text-transform: uppercase;
  vertical-align: middle;
}
.table .thead-light th span span{
  color: var(--text__color) !important;
}
.table .thead-light th span{
  cursor: pointer;
  display: flex;
  align-items: center;
}
.table .thead-light th:not(:first-child), .drag th:first-child{
  padding: 0 25px 0 10px;
}
.mi-header-option{
  height: fit-content;
  position: absolute;
  display: none;
  right: 3px;
  background: var(--url__icon) no-repeat;
  cursor: pointer;
  top: calc(50% - 8px);
  min-width: 16px;
  min-height: 16px;
  background-position: -1687px -564px;
}
tbody tr td:first-child {
  z-index: 1;
}
thead tr th {
  z-index: 2;
}
.table .thead-light th:hover .mi-header-option{
  display: block;
}
.table .thead-light th.fix:last-child {
  border-right: none;
}
tbody tr:hover,
tbody tr:hover .z3,
.table tbody tr:hover th:last-child,
.table tbody tr:hover th:first-child,
.table tbody tr:hover td:last-child,
.table tbody tr:hover td:first-child {
  background-color: #f2f9ff;
}

.row-selected{
  background-color: #f5ecda !important;
  .column-sticky, .column-end{
    background-color: #f5ecda !important;
  }
}

tbody tr.active,
tbody tr.active .z3,
.table tbody tr.active th:last-child,
.table tbody tr.active th:first-child,
.table tbody tr.active td:last-child,
.table tbody tr.active td:first-child {
  background-color: #e5f3ff;
}
.table tbody th,
.table tbody td {
  padding: 0 10px;
  min-height: 44px;
  height: 44px;
  border-right: 1px dotted #c7c7c7;
  border-bottom: 1px solid #c7c7c7;
}
.table tbody td
.table tbody td .data-table-bind{
  white-space: pre-wrap; 
}
.table tbody td .data-table-bind.hidden-space_1{
  overflow: hidden; 
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  display: -webkit-box;
}
.table tbody td .data-table-bind.hidden-space_2{
  overflow: hidden; 
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  display: -webkit-box;
}
.table tbody td .data-table-bind.hidden-space_3{
  overflow: hidden; 
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  display: -webkit-box;
}
.table .thead-light th.fix:last-child,
.table .thead-light th.fix:first-child {
  z-index: 3;
  background-color: #e5e8ec;
}
.table .thead-light th.fix:last-child,
.table tbody th.fix:last-child,
.table tbody td.fix:last-child {
  right: 15px !important;
}
.table .thead-light th.fix:last-child::before,
.table tbody th:last-child::before,
.table tbody td:last-child::before {
  content: "";
  right: -16px;
  top: 0;
  width: 16px;
  height: 110%;
  position: absolute;
  background-color: var(--while__color);
}
.table .thead-light th.fix:first-child:not(.check-false),
.table tbody th:first-child,
.table tbody td:first-child {
  left: 16px;
}
.table .thead-light th.fix:first-child::before,
.table tbody th:first-child::before,
.table tbody td:first-child::before {
  content: "";
  left: -16px;
  top: 0;
  width: 16px;
  height: 110%;
  position: absolute;
  background-color: var(--while__color);
}
.table .thead-light th.fix:last-child,
.table .thead-light th.fix:first-child,
.table tbody th.fix:last-child,
.table tbody th:first-child,
.table tbody td.fix:last-child,
.table tbody td:first-child {
  position: -webkit-sticky;
  position: sticky;
}
.table tbody th.fix:last-child,
.table tbody td.fix:last-child{
  background-color: aliceblue;
  /* background-color: var(--while__color); */
}
.column-sticky{
  background-color: aliceblue;
  /* background-color: var(--while__color); */
}
.table tbody td:last-child {
  border-right: none;
}
.table .thead-light th.fix:first-child,
.table tbody th:first-child {
  min-width: 40px;
  max-width: 40px;
}
.border-icon_table {
  border: solid 1px transparent;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
.image-table{
  height: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
} 
.image-table img{
  height: 100%;
}
.sort{
  width: 16px;
    height: 16px;
    min-width: 16px;
    min-height: 16px;
    background: var(--url__icon) no-repeat;
    background-position: -1752px -312px;
} 
.sortASC{
  transform: rotate(180deg);
}
.table-footer{
  position: relative;
}
.table-footer th{
  bottom: 56px !important;
  padding-right: 10px !important;
  border-color: #E5E8EC !important;
}
.center{
  text-align: center !important;
}
.right{
  text-align: right !important;
}
.left{
  text-align: left !important;
}

.checkBox{
  width: 18px;
  margin: 0 auto;
}

.table-scroll {
  padding: 0 16px;
  background-color: var(--while__color);
  display: table;
  table-layout: fixed;
  width: 100%;
}
.table-container {
  display: table-cell;
  width: 100%;
  background-color: var(--while__color);
}
.paging-container {
  padding: 12px 51px 12px 16px;
  background-color: var(--while__color);
  display: flex;
  align-items: flex-end;
	z-index: 4;
  justify-content: space-between;
  margin-right: -1px;
}
.paging {
  display: flex;
  align-items: center;
  justify-content: center;
}
.common-illegal{
  color: red;
}
.common-valid{
  color: var(--primary__color);
}
.column-end{
  border-left: 1px dotted #c7c7c7;
  z-index: 4 !important;
}
thead .column-end{
  z-index: 5 !important;
  border-left: 1px solid #c7c7c7;
}
.header-content-end{
  border-right: unset !important;
}
thead .z3{
  z-index: 5 !important;
}
tbody .z3{
  background-color: var(--while__color);
  z-index: 3 !important;
}
.remove-selected-all{
  color: var(--primary__color);
  cursor: pointer;
  &:hover{
    text-decoration: underline;
  }
}
</style>
