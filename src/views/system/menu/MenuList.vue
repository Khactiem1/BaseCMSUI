<template>
  <div class="container-table">
		<div class="container-table_header">
      <div class="name-table">
        <h1>{{ $t('i18nMenu.Title') }}</h1>
      </div>
      <div class="action-table">
        <div class="btn-add">
          <ms-button v-if="checkActionPermission('Add')" @click="add" class="primary">
            {{ $t('i18nEnum.FormState.Add') }}
          </ms-button>
        </div>
      </div>
    </div>
    <div class="table-function sticky">
      <div class="form-fix">
        <div class="action-left flex">

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
        <div class="action-render_table export-data" @click="exportData" :content="$t('i18nCommon.export_excel')"></div>
        <div class="action-render_table setting-table" v-if="checkActionPermission('ShowColumns')" @click="configLayout" :content="$t('i18nCommon.customize_interface')"></div>
      </div>
    </div>
    <ms-grid-tree
      :ref="viewRef"
      :data="storeModule.items"
      :pageTotal="storeModule.total"
      :loading="storeModule.loading"
      :idField="'menu_id'"
      :gridInfo="gridInfo"
      :loadData="loadData"
      :multiple="false"
      @handleDoubleClickRow="edit"
    >
      <template #widget-body="{ record }">
        <div class="widget-container">
          <button v-if="checkActionPermission('Edit')" @click="edit(record)" class="action-table action-table_left">
            <div class="action-default">
              {{$t('i18nEnum.FormState.Edit')}}
            </div>
          </button>
          <button v-else-if="checkActionPermission('Delete')" @click="deleteRow(record)" class="action-table action-table_left">
            <div class="action-default">
              {{$t('i18nEnum.FeatureRow.Delete')}}
            </div>
          </button>
          <menu-wrapper class="widget-more-container" :style="{'margin-left': '4px'}" :usingClickoutSide ="true">
            <template #menu-button="{ toggleMenu }">
              <div @click="toggleMenu" class="icon20 feature-more-blur"></div>
            </template>
            <template #menu-content>
              <menu-item v-if="checkActionPermission('Delete')" class="menu-item-feture" @menu-item-click="deleteRow(record)">
                <span>{{ $t('i18nEnum.FeatureRow.Delete') }}</span>
              </menu-item>
              <menu-item class="menu-item-feture" v-if="record.is_active && checkActionPermission('Edit')" @menu-item-click="toggleActive([record], false)">
                <span>{{ $t('i18nEnum.FeatureRow.Inactive') }}</span>
              </menu-item>
              <menu-item class="menu-item-feture" v-else-if="checkActionPermission('Edit')" @menu-item-click="toggleActive([record], true)">
                <span>{{ $t('i18nEnum.FeatureRow.Active') }}</span>
              </menu-item>
            </template>
          </menu-wrapper>
        </div>
      </template>
    </ms-grid-tree>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref } from "vue";
import MsGridTree from '@/components/msGridViewer/MsGridTree.vue'
import ListConditionFilter from '@/components/msGridViewer/ListConditionFilter.vue';
import BaseList from '@/views/base/BaseList'
import useModuleMenu from '@/stores/system/moduleMenu';
import MenuItem from '@/components/dropdown/MenuItem.vue';
import MenuWrapper from '@/components/dropdown/MenuWrapper.vue';
import menuAPI from '@/apis/system/menuAPI'
import { showError } from "@/commons/globalMessage";

export default defineComponent({
  components: {
    MsGridTree,
    ListConditionFilter,
    MenuItem,
    MenuWrapper,
  },
  extends: BaseList,
  setup: () => {
    const { proxy } : any = getCurrentInstance(); // Instance của component
    const storeModule: any = useModuleMenu(); // Cấu hình store
    const layoutTag = ref('MenuList'); // Cấu hình layout
    const formDetailName = ref('MenuDetail'); // Cấu hình tên form detail
    const api = ref(menuAPI); // Cấu hình api
    const subSystemCode = ref('menu'); // Cấu hình phân quyền
    
    /**
		 * Xử lý custom tham số load data trước khi call lên serve lấy dữ liệu
     * @override
		 */
    const customParamLoadData = async (param: any) => {
      if(param.Columns){
        param.Columns = param.Columns.concat(',parent_id');
      }
      else{
        param.Columns = param.Columns.concat('parent_id');
      }
      // Hình cây nên load all luôn
      param.PageIndex = 0;
      param.PageSize = 0;
    };

    /**
     * Xoá một bản ghi trên danh sách
     * @override
     */
    const deleteRow = async (record: any) => {
      const me: any = proxy;
      if(record.is_parent){
        showError(me.$t('i18nMenu.ErrorDeleteParent'));
        return;
      }
      await me.super('deleteRow', BaseList, record);
    };

    return {
      api,
      subSystemCode,
      layoutTag,
      storeModule,
      formDetailName,
      deleteRow,
      customParamLoadData,
    }
  },
});
</script>

<style lang="scss" scoped>

</style>
