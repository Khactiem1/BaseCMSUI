<template>
  <div ref="elmMain" :style="{
      top: setPositionFilter.top + 'px',
      left: setPositionFilter.left + 'px',
    }" class="condition-container">
    <div class="lock" :class="`${col.lock ? 'fixing' : ''}`">
        {{ col.lock ? $t('i18nControl.MsGridViewer.un_pin') : $t('i18nControl.MsGridViewer.fixed_column') }}
    </div>
    <div class="filter-container">
        <div class="view-filter-text">
            <div class="column-filter">
              {{ $t('i18nControl.MsGridViewer.filter') }} {{ col.headerCustom ? col.headerCustom : $t(col.header)}}
            </div>
            <div v-if="selectComparison.length" class="filter-op-dropdown">
              <div ref="elmDropDown" @click="isShowDropDown = !isShowDropDown;" class="drop-icon">
                {{ comparisonType.enumText }}
              </div>
              <div 
                v-if="isShowDropDown" class="dropdown-list"
                v-click-outside="() => { isShowDropDown = !isShowDropDown }"
              >
                <div v-for="(item, index) in selectComparison" @click="handleSelectComparisonType(item)" :key="index" class="dropdown-item">
                  {{ item.enumText }}
                </div>
              </div>
            </div>
        </div>
        <div class="filter-value">
          <component
            @keydown.enter="handleFilter"
            :ref="'refFilterControl'"
            :is="componentInput"
            v-model="valueFilter"
            :disabled="comparisonType?.enumKey === 'Null' || comparisonType?.enumKey === 'NotNull'"
            :placeholder="$t('i18nCommon.enter_filter')"
            :value="'enumValue'"
            :header="'enumText'"
            :enum="col.enum"
          />
        </div>
    </div>
    <div class="filter-footer">
      <button class="btn" @click="handleUnFilter">{{ $t('i18nControl.MsGridViewer.un_filter') }}</button>
      <button class="btn primary" @click="handleFilter">{{ $t('i18nControl.MsGridViewer.filter') }}</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, computed, getCurrentInstance, reactive } from 'vue';

export default defineComponent({
  props: {
    col: {
      type: Object,
      default: {}
    },
    /**
     * Hàm xử lý đóng mở form filter
     */
    handleShowFilter: {
      type: Function,
      default: ()=> {}
    },

    /**
     * Hàm xử lý fix column trên thanh header
     */
    handleFixColumn: {
      type: Function,
      default: ()=> {}
    },

    /**
     * set vị trí hiển thị form
     */
    setPositionFilter: {
      default: {
        top: 0,
        left: 1,
      },
    },
  },
  setup(){
    const { proxy }: any = getCurrentInstance();
    const allOperator: any [] = reactive(proxy.$ms.commonFn.getEnumSource("FilterOperator")); // toàn bộ toán tử
    const isShowDropDown = ref(false); // Biến lưu trạng thái show dropdown chọn cách lọc
    const comparisonType: any = ref({}); // toán tử đang được lựa chọn
    const valueFilter: any = ref(null); // Giá trị filter

    /**
     * Kiểu toán tử đối với kiểu dữ liệu tương ứng
     */
    const selectComparison = computed(() => {
      const me: any = proxy;
      let result = [];
      switch (me.col.formatType) {
        case me.$ms.constant.FormatType.Text:
          comparisonType.value = allOperator.find((_: any) => _.enumKey === 'Contains'); // gán toán tử mặc định
          valueFilter.value = null;
          result = allOperator.filter((_: any) => !["GreaterThan", "GreaterThanEquals", "LessThan", "LessThanEquals"].includes(_.enumKey));
          break;
        case me.$ms.constant.FormatType.Number:
        case me.$ms.constant.FormatType.Date:
          comparisonType.value = allOperator.find((_: any) => _.enumKey === 'Equals'); // gán toán tử mặc định
          valueFilter.value = null;
          result = allOperator.filter((_: any) => !["Contains", "Notcontains", "StartsWith", "EndsWith"].includes(_.enumKey));
          break;
        case me.$ms.constant.FormatType.Enum:
          comparisonType.value = allOperator.find((_: any) => _.enumKey === 'Equals'); // gán toán tử mặc định
          valueFilter.value = null;
          break;
      }
      if(me.col.filter){
        comparisonType.value = me.col.filter.comparisonType;
        valueFilter.value = me.col.filter.value;
      }
      return result;
    });

    /**
     * Component filter
     */
    const componentInput = computed(() => {
      const me: any = proxy;
      let result = '';
      switch (me.col.formatType) {
        case me.$ms.constant.FormatType.Text:
          result = 'ms-input';
          break;
        case me.$ms.constant.FormatType.Number:
          result = 'ms-number'
          break;
        case me.$ms.constant.FormatType.Date:
          result = 'ms-datepicker'
          break;
        case me.$ms.constant.FormatType.Enum:
          result = 'ms-combobox'
          break;
      }
      me.$nextTick(() => {
        me.$ms.commonFn.focusFirstControl(me.$refs['refFilterControl']?.$el);
      });
      return result;
    });

    /**
     * Thực hiện filter cột
     */
    const handleFilter = () => {
      const me: any = proxy;
      if(comparisonType.value?.enumKey === 'Null' || comparisonType.value?.enumKey === 'NotNull' || valueFilter.value || valueFilter.value == 0){
        me.col.filter = {
          operator: comparisonType.value.enumValue,
          value: valueFilter.value,
          comparisonType: comparisonType.value,
        };
      }
      else{
        me.col.filter = null;
      }
      me.handleShowFilter(null, null, true);
    };

    /**
     * Bỏ lọc cột
     */
    const handleUnFilter = () => {
      const me: any = proxy;
      me.col.filter = null;
      me.handleShowFilter(null, null, true);
    }

    /**
     * Chọn toán tử
     * @param item 
     */
    const handleSelectComparisonType = (item: any) => {
      if(item?.enumKey === 'Null' || item?.enumKey === 'NotNull'){
        valueFilter.value = null;
      }
      comparisonType.value = item;
      isShowDropDown.value = !isShowDropDown.value;
    };

    return{
      selectComparison,
      isShowDropDown,
      comparisonType,
      handleSelectComparisonType,
      componentInput,
      valueFilter,
      handleUnFilter,
      handleFilter,
    }
  },
});
</script>

<style scoped>
.condition-container{
  font-family: "notosans-regular";
  position: absolute;
  padding: 22px 17px;
  border: 1px solid #babec5;
  z-index: 10;
  background: #fff;
  min-width: 350px;
  max-width: 350px;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  font-weight: 400;
  font-size: 13px;
  border-radius: 2px;
  box-shadow: 3px 3px 6px #ddd;
  border-radius: 3px;
}
.condition-container .lock{
  position: relative;
  padding-left: 30px;
  line-height: 24px;
  cursor: pointer;
  border-bottom: 1px solid #ebedf0;
  padding-bottom: 14px;
  margin-bottom: 14px;
}
.condition-container .lock::before{
  content: "";
  position: absolute;
  display: block;
  height: 24px;
  width: 24px;
  top: 0;
  left: 2px;
  background: transparent var(--url__icon) no-repeat -1726px -560px;
}
.condition-container .lock.fixing::before{
  background-position: -1766px -560px;
}
.view-filter-text{
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  justify-content: space-between;
}
.filter-op-dropdown{
  font-size: 13px;
  font-weight: 600;
  color: #0075c0;
  cursor: pointer;
  position: relative;
  position: relative;
  display: inline-block;
  margin-left: 15px;
  line-height: 19px;
}
.drop-icon{
  padding-right: 20px;
  font-family: 'notosans-bold';
}
.drop-icon::after{
  content: "";
  position: absolute;
  height: 10px;
  width: 13px;
  background: transparent var(--url__icon) no-repeat -178px -363px;
  top: 4px;
  right: 2px;
}
.filter-footer{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}
.dropdown-list{
  background: #fff;
  padding: 2px 1px;
  border-radius: 2px;
  border: 1px solid #babec5;
  position: absolute;
  color: var(--text__color);
  text-align: left;
  font-weight: 400;
  font-size: 13px;
  z-index: 5;
  width: 150px;
  top: 100%;
  right: 0;
  transition: all ease .2s;
}
.dropdown-item{
  background: inherit;
  color: inherit;
  cursor: pointer;
  transition: all .2s ease;
  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
  width: 100%;
  display: block;
}
.dropdown-item:hover{
  color: var(--primary__color) !important;
  background-color: #ebedf0 !important;
}
.radio{
  display: flex;
  flex-wrap: wrap;
}
.radio-item{
  margin-right: 16px;
  margin-bottom: 6px;
}
</style>