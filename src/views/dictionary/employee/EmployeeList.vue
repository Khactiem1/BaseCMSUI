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
        <button class="table-function_series toggle-list">
          <span>{{ $t('i18nCommon.batch_execution') }}</span>
          <div class="table-function_series-icon"></div>
          <div v-show="true" class="table-list_action">
            <div class="list_action-item" @click="">{{ $t('i18nEnum.ModelState.Delete') }}</div>
          </div>
        </button>
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
import { defineComponent, getCurrentInstance, ref } from "vue";
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
    
    return {
      api,
      layoutTag,
      storeModule,
      formDetailName,
    }
  },
});
</script>

<style lang="scss" scoped>

</style>
