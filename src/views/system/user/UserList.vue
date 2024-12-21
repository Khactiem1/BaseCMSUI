<template>
  <div class="container-table">
		<div class="container-table_header">
      <div class="name-table">
        <h1>{{ $t('i18nUser.Title') }}</h1>
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
          <button style="margin-right: 8px;" class="table-function_series toggle-list">
            <span>{{ $t('i18nCommon.batch_execution') }}</span>
            <div class="table-function_series-icon"></div>
            <div v-show="true" class="table-list_action" v-if="gridInfo.selected?.length">
              <div class="list_action-item" v-if="checkActionPermission('Delete')" @click="deleteMultiple">{{ $t('i18nEnum.ModelState.Delete') }}</div>
              <div class="list_action-item" v-if="checkActionPermission('Edit')" @click="toggleActive(gridInfo.selected, true)">{{ $t('i18nEnum.FeatureRow.Active') }}</div>
              <div class="list_action-item" v-if="checkActionPermission('Edit')" @click="toggleActive(gridInfo.selected, false)">{{ $t('i18nEnum.FeatureRow.Inactive') }}</div>
              <div class="list_action-item" v-if="checkActionPermission('Edit')" @click="resetPassword(gridInfo.selected)">{{ $t('i18nUser.ResetPassword') }}</div>
            </div>
          </button>
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
    <ms-grid-viewer
      :ref="viewRef"
      :data="storeModule.items"
      :pageTotal="storeModule.total"
      :loading="storeModule.loading"
      :idField="'user_id'"
      :gridInfo="gridInfo"
      :loadData="loadData"
      @handleDoubleClickRow="edit"
    >
      <template #avartar="{ record }">   
        <div class="image-table">
          <img v-if="record.avartar" v-bind:src="fileAPI.getFileViewUrl(record.avartar)">
        </div>
      </template>
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
              <menu-item v-if="checkActionPermission('Add')" class="menu-item-feture" @menu-item-click="duplicate(record)">
                <span>{{ $t('i18nEnum.FormState.Duplicate') }}</span>
              </menu-item>
              <menu-item v-if="checkActionPermission('Delete')" class="menu-item-feture" @menu-item-click="deleteRow(record)">
                <span>{{ $t('i18nEnum.FeatureRow.Delete') }}</span>
              </menu-item>
              <menu-item class="menu-item-feture" v-if="record.is_active && checkActionPermission('Edit')" @menu-item-click="toggleActive([record], false)">
                <span>{{ $t('i18nEnum.FeatureRow.Inactive') }}</span>
              </menu-item>
              <menu-item class="menu-item-feture" v-else-if="checkActionPermission('Edit')" @menu-item-click="toggleActive([record], true)">
                <span>{{ $t('i18nEnum.FeatureRow.Active') }}</span>
              </menu-item>
              <menu-item v-if="checkActionPermission('Edit')" class="menu-item-feture" @menu-item-click="resetPassword([record])">
                <span>{{ $t('i18nUser.ResetPassword') }}</span>
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
import useModuleUser from '@/stores/system/moduleUser';
import MenuItem from '@/components/dropdown/MenuItem.vue';
import MenuWrapper from '@/components/dropdown/MenuWrapper.vue';
import userAPI from '@/apis/system/userAPI'
import { showAlert } from "@/commons/globalMessage";
import fileAPI from "@/apis/file/fileAPI";

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
    const storeModule: any = useModuleUser(); // Cấu hình store
    const layoutTag = ref('UserList'); // Cấu hình layout
    const formDetailName = ref('UserDetail'); // Cấu hình tên form detail
    const subSystemCode = ref('user'); // Cấu hình phân quyền
    const api = ref(userAPI); // Cấu hình api

    /**
     * Xử lý đặt lại mật khẩu mặc định cho nhiều user cùng lúc
     */
    const resetPassword = async (users: any []) => {
      const me: any = proxy;
      const result = await showAlert(me.$t('i18nCommon.AskResetPassword'));
      if(result){
        const result = await userAPI.resetPassword(users);
        if(result?.Data){
          me.$ms.commonFn.pushNotification({
						type: me.$ms.constant.ENotificationType.Success,
						message: me.$t('i18nCommon.crud.update_success'),
					});
        }
      }
    };
    
    return {
      api,
      fileAPI,
      layoutTag,
      storeModule,
      subSystemCode,
      formDetailName,
      resetPassword,
    }
  },
});
</script>

<style lang="scss" scoped>

</style>
