<template>
  <div class="container-table">
		<div class="container-table_header">
      <div class="name-table">
        <h1>{{ $t('i18nRole.Title') }}</h1>
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
    <ms-grid-viewer
      :ref="viewRef"
      :data="storeModule.items"
      :pageTotal="storeModule.total"
      :loading="storeModule.loading"
      :idField="'role_id'"
      :gridInfo="gridInfo"
      :loadData="loadData"
      :multiple="false"
      @handleDoubleClickRow="edit"
    >
      <template #widget-body="{ record }">
        <div v-if="!record.is_administrator" class="widget-container">
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
import useModuleRole from '@/stores/system/moduleRole';
import MenuItem from '@/components/dropdown/MenuItem.vue';
import MenuWrapper from '@/components/dropdown/MenuWrapper.vue';
import roleAPI from '@/apis/system/roleAPI'

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
    const storeModule: any = useModuleRole(); // Cấu hình store
    const layoutTag = ref('RoleList'); // Cấu hình layout
    const formDetailName = ref('RoleDetail'); // Cấu hình tên form detail
    const subSystemCode = ref('role'); // Cấu hình phân quyền
    const api = ref(roleAPI); // Cấu hình api

    /**
     * bổ sung check ko mở form sửa đối với role Administrator
     * @override
     */
    const edit = async (record: any) => {
      const me: any = proxy;
      if(!record.is_administrator){
        await me.super('edit', BaseList, record);
      }
    };

    /**
		 * Xử lý custom tham số load data trước khi call lên serve lấy dữ liệu
     * @override
		 */
    const customParamLoadData = async (param: any) => {
      if(param.Columns){
        param.Columns = param.Columns.concat(',is_administrator');
      }
      else{
        param.Columns = param.Columns.concat('is_administrator');
      }
    };
    
    return {
      api,
      layoutTag,
      storeModule,
      formDetailName,
      subSystemCode,
      edit,
      customParamLoadData,
    }
  },
});
</script>

<style lang="scss" scoped>

</style>
