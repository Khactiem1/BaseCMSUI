<template>
  <div class="container-table">
		<div class="container-table_header">
      <div class="name-table">
        <h1>{{ $t('i18nEmployee.Title') }}</h1>
      </div>
      <div class="action-table">
        <div class="btn-add">
					<button @click="add" class="add">{{ $t('i18nEnum.FormState.Add') }}</button>
					<button class="import toggle-list">
            <i class="icon"></i>
            <div class="table-list_action">
              <div @click="" class="list_action-item"><i class="i excel"></i> {{ $t('i18nCommon.export_sample') }}</div>
              <div @click="" class="list_action-item"><i class="i excel"></i> {{ $t('i18nCommon.import') }}</div>
            </div>
          </button>
        </div>
      </div>
    </div>
    <div class="table-function sticky">
      <div class="form-fix">
        <div class="action-left flex">
          <button style="margin-right: 8px;" class="table-function_series toggle-list">
            <span>{{ $t('i18nCommon.batch_execution') }}</span>
            <div class="table-function_series-icon"></div>
            <div v-show="true" class="table-list_action" v-if="gridInfo.selected?.length">
              <div class="list_action-item" @click="deleteMultiple">{{ $t('i18nEnum.ModelState.Delete') }}</div>
              <div class="list_action-item" @click="toggleActive(gridInfo.selected, false)">{{ $t('i18nEnum.FeatureRow.Active') }}</div>
              <div class="list_action-item" @click="toggleActive(gridInfo.selected, true)">{{ $t('i18nEnum.FeatureRow.Inactive') }}</div>
            </div>
          </button>
          <menu-wrapper class="topnav-widget-more-container" :hideInContent="false" :position="{ at: 'left bottom', my: 'left top' }">
            <template #menu-button="{ toggleMenu }">
              <ms-button
                style="height: 30px;"
                :class="[`${isFilterAdvanced ? 'bg-orange-medium' : ''}`]"
                @click="toggleMenu"
              >
                {{ $t('i18nControl.MsGridViewer.filter') }}
              </ms-button>
            </template>
            <template #menu-content="{ closeHandler }">
              <div class="padding-body-filter">
                <div class="padding-body-filter-content">
                  <label class="label">{{ $t('i18nEmployee.FilterGender') }}:</label>
                  <ms-checkbox
                    style="margin-bottom: 8px;" 
                    v-model="filterGender.male"
                  >
                    <div class="info-checkbox">{{ $t('i18nEnum.Gender.Male') }}</div>
                  </ms-checkbox>
                  <ms-checkbox
                    style="margin-bottom: 8px;" 
                    v-model="filterGender.female"
                  >
                    <div class="info-checkbox">{{ $t('i18nEnum.Gender.Female') }}</div>
                  </ms-checkbox>
                  <ms-checkbox
                    v-model="filterGender.other"
                  >
                    <div class="info-checkbox">{{ $t('i18nEnum.Gender.Other') }}</div>
                  </ms-checkbox>
                </div>
                <div class="filter-line"></div>
                <div class="padding-body-filter-footer">
                  <ms-button @click="closeHandler"> {{ $t('i18nCommon.Close') }} </ms-button>
                  <ms-button class="primary" @click="doFilter(closeHandler)"> {{ $t('i18nControl.MsGridViewer.filter') }} </ms-button>
                </div>
              </div>
            </template>
          </menu-wrapper>
        </div>
        <list-condition-filter :grid="$refs[viewRef]" @loadData="loadData"></list-condition-filter>
      </div>
      <div style="min-width: 320px;" class="table-function_search">
        <ms-input 
          @input="debounceSearch" 
          v-model="searchText"
          :placeholder="$t('i18nCommon.search')"
        />
        <div class="action-render_table reload-table" @click="loadData" :content="$t('i18nCommon.load_data')"></div>
        <div class="action-render_table export-data" :content="$t('i18nCommon.export_excel')"></div>
        <div class="action-render_table setting-table" @click="configLayout" :content="$t('i18nCommon.customize_interface')"></div>
      </div>
    </div>
    <ms-grid-viewer
      :ref="viewRef"
      :data="storeModule.items"
      :pageTotal="storeModule.total"
      :loading="storeModule.loading"
      :idField="'employee_id'"
      :gridInfo="gridInfo"
      :loadData="loadData"
      @handleDoubleClickRow="edit"
    >
      <template #employee_name="{ record }">
        {{ record.employee_code }} / {{ record.employee_name }}
      </template>
      <template #widget-body="{ record }">
        <div class="widget-container">
          <button @click="edit(record)" class="action-table action-table_left">
            <div class="action-default">
              {{$t('i18nEnum.FormState.Edit')}}
            </div>
          </button>
          <menu-wrapper class="widget-more-container" :style="{'margin-left': '4px'}" :usingClickoutSide ="true">
            <template #menu-button="{ toggleMenu }">
              <div @click="toggleMenu" class="icon20 feature-more-blur"></div>
            </template>
            <template #menu-content>
              <menu-item class="menu-item-feture" @menu-item-click="duplicate(record)">
                <span>{{ $t('i18nEnum.FormState.Duplicate') }}</span>
              </menu-item>
              <menu-item class="menu-item-feture" @menu-item-click="deleteRow(record)">
                <span>{{ $t('i18nEnum.FeatureRow.Delete') }}</span>
              </menu-item>
              <menu-item class="menu-item-feture" v-if="record.inactive" @menu-item-click="toggleActive([record], false)">
                <span>{{ $t('i18nEnum.FeatureRow.Active') }}</span>
              </menu-item>
              <menu-item class="menu-item-feture" v-else @menu-item-click="toggleActive([record], true)">
                <span>{{ $t('i18nEnum.FeatureRow.Inactive') }}</span>
              </menu-item>
            </template>
          </menu-wrapper>
        </div>
      </template>
    </ms-grid-viewer>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref, reactive } from "vue";
import MsGridViewer from '@/components/msGridViewer/MsGridViewer.vue'
import ListConditionFilter from '@/components/msGridViewer/ListConditionFilter.vue';
import BaseList from '@/views/base/BaseList'
import useModuleEmployee from '@/stores/dictionary/moduleEmployee';
import MenuItem from '@/components/dropdown/MenuItem.vue';
import MenuWrapper from '@/components/dropdown/MenuWrapper.vue';
import employeeAPI from '@/apis/dictionary/employeeAPI'

export default defineComponent({
  components: {
    MsGridViewer,
    ListConditionFilter,
    MenuItem,
    MenuWrapper,
  },
  extends: BaseList,
  setup: () => {
    const { proxy } : any = getCurrentInstance(); // Instance của component
    const storeModule: any = useModuleEmployee(); // Cấu hình store
    const layoutTag = ref('EmployeeList'); // Cấu hình layout
    const formDetailName = ref('EmployeeDetail'); // Cấu hình tên form detail
    const api = ref(employeeAPI); // Cấu hình api
    const isFilterAdvanced = ref(false); // Cờ đánh dấu là đang thực hiện lọc nâng cao
    /** Bộ lọc nâng cao */
    const filterGender = reactive({
      male: false,
      female: false,
      other: false,
    });

    /**
     * Thực hiện lọc nâng cao
     * @author nktiem 05.12.2024
     */
    const doFilter = (closeHandler: Function) => {
      const me: any = proxy;
      if(typeof me.$refs[me.viewRef]?.loadPageIndex === 'function'){
        me.$refs[me.viewRef].loadPageIndex(1);
      }
      if(typeof closeHandler === 'function'){
        closeHandler();
      }
    };

    /**
		 * Xử lý custom tham số load data trước khi call lên serve lấy dữ liệu
     * Xử lý thêm lọc nâng cao giới tính
     * @override
     * @author nktiem 05.12.2024
		 */
    const customParamLoadData = (param: any) => {
      const me: any = proxy;
      let customFilterGender: any [] = [];
      let isPushOr = false;
      if(filterGender.male){
        customFilterGender.push(['gender', '=', me.$ms.constant.Gender.Male]);
        isPushOr = true;
      }
      if(filterGender.female){
        if(isPushOr){
          customFilterGender.push("or");
        }
        customFilterGender.push(['gender', '=', me.$ms.constant.Gender.Female]);
        isPushOr = true;
      }
      if(filterGender.other){
        if(isPushOr){
          customFilterGender.push("or");
        }
        customFilterGender.push(['gender', '=', me.$ms.constant.Gender.Other]);
      }
      me.$ms.commonFn.concatFilter(param, customFilterGender);
      if(customFilterGender?.length){
        isFilterAdvanced.value = true;
        return;
      }
      isFilterAdvanced.value = false;
    };
    
    return {
      api,
      layoutTag,
      storeModule,
      formDetailName,
      filterGender,
      isFilterAdvanced,
      doFilter,
      customParamLoadData,
    }
  },
});
</script>

<style lang="scss" scoped>

</style>
