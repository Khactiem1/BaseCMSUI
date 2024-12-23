<template>
	<ms-dynamic-popup
    :maximum="true"
		:title="`${editMode ? $ms.commonFn.getEnumResource(editMode ,'FormState') : ''} ${$t('i18nRole.Title')}`" 
		@beforeOpen="beforeOpen"
	>
		<template v-slot:content="{ close }">
			<div ref="slot-content" class="form-content-popup">
        <div class="form-container">
          <div class="form-detail flex">
            <div class="form-group">
              <ms-input
                :maxLength="30"
                :rules="[{ name: 'required' }, ]"
                :label="$t('i18nRole.Detail.role_code')" 
                v-model="model.role_code"
              ></ms-input>
            </div>
            <div class="form-group">
              <ms-input
                :maxLength="80"
                :rules="[{ name: 'required' }, ]"
                :label="$t('i18nRole.Detail.role_name')" 
                v-model="model.role_name"
              ></ms-input>
            </div>
            <div class="form-group">
              <ms-input
                :maxLength="255"
                :label="$t('i18nRole.Detail.description')" 
                v-model="model.description"
              ></ms-input>
            </div>
          </div>
          <div class="decentralization">
            <!-- <div class="left-menu">
              <div class="title-menu">
                {{ $t('i18nRole.Power') }}
              </div>
              <div class="list-menu">
                <div 
                  v-for="subSystem in defaultMscSubSystemList"
                  :key="subSystem.sub_system_code"
                  class="box-item"
                  :class="[`${subSystem.active ? 'active': ''}`]"
                  @click="activeSubSystem(subSystem)"
                >
                  <div class="name">{{ subSystem.sub_system_name }}</div>
                </div>
              </div>
            </div> -->
            <div class="container">
              <div class="decentralization-container">
                <div 
                  class="collapse-item-con"
                >
                  <div class="ms-collapse-item--header">
                    <div class="collapse-header-title">
                      {{ $t('i18nMenu.sub_system_code.decentralization') }}
                    </div>
                  </div>
                  <div class="ms-collapse-item--content">
                    <ms-grid-tree
                      :ref="viewRef"
                      :columns="column"
                      :multiple="false"
                      :showAction="false"
                      :filterable="false"
                      :idField="'menu_id'"
                      :data="model.RoleDetail"
                    >
                    <template #All="{ record }">
                      <div v-if="!record.is_parent" class="flex flex-center item-checkbox">
                        <ms-checkbox
                          :checked="allPermissionRow(record)" 
                          @custom-handle-click-checkbox="changeCheckedAllPermissionRow(record)"
                        >
                        </ms-checkbox>
                      </div>
                    </template>
                    <template #menu_code="{ record }">
                      {{ $t(`i18nMenu.sub_system_code.${record.menu_code}`) }}
                    </template>
                    <template #View="{ record }">
                      <div v-if="!record.is_parent" class="flex flex-center item-checkbox">
                        <ms-checkbox v-model="record.list_permission.View"></ms-checkbox>
                      </div>
                    </template>
                    <template #Add="{ record }">
                      <div v-if="!record.is_parent" class="flex flex-center item-checkbox">
                        <ms-checkbox v-model="record.list_permission.Add"></ms-checkbox>
                      </div>
                    </template>
                    <template #Edit="{ record }">
                      <div v-if="!record.is_parent" class="flex flex-center item-checkbox">
                        <ms-checkbox v-model="record.list_permission.Edit"></ms-checkbox>
                      </div>
                    </template>
                    <template #Delete="{ record }">
                      <div v-if="!record.is_parent" class="flex flex-center item-checkbox">
                        <ms-checkbox v-model="record.list_permission.Delete"></ms-checkbox>
                      </div>
                    </template>
                    <template #ShowColumns="{ record }">
                      <div v-if="!record.is_parent" class="flex flex-center item-checkbox">
                        <ms-checkbox v-model="record.list_permission.ShowColumns"></ms-checkbox>
                      </div>
                    </template>
                    </ms-grid-tree>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
			</div>
		</template>
		<template v-slot:footer="{ close }">
			<div class="form-action">
        <div class="form-action_container">
          <div class="form-action_item">
            <ms-button
							@click="close"
						>
							{{ $t('i18nCommon.Close') }}
						</ms-button>
          </div>
          <div class="form-action_item">
            <ms-button
							@click="save"
							class="primary"
						>
							{{ $t('i18nCommon.crud.save') }}
						</ms-button>
          </div>
        </div>
      </div>
		</template>
	</ms-dynamic-popup>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref } from 'vue';
import useModuleRole from '@/stores/system/moduleRole';
import roleAPI from '@/apis/system/roleAPI'
import BaseDetail from '@/views/base/BaseDetail'
import MsGridTree from '@/components/msGridViewer/MsGridTree.vue';
import menuAPI from '@/apis/system/menuAPI';

export default defineComponent({
	mixins: [],
	components: {
    MsGridTree,
	},
	extends: BaseDetail,
	setup() {
		const { proxy }: any = getCurrentInstance(); // Instance của component
		const storeModule: any = useModuleRole(); // Cấu hình store
		const api = ref(roleAPI); // Cấu hình api
    const subSystemCode = ref('role'); // Cấu hình phân quyền

		/**
		 * Xử lý dữ liệu trước khi binding
		 * @override
		 */
		const beforeBindData = async () => {
			const me: any = proxy;
      const allMenu = await loadAllMenu();
      if(!allMenu?.length) return;
      if(me._formParam.dataRow){
        if (me.editMode == me.$ms.constant.FormState.Add && me._formParam.dataRow){
          allMenu.forEach((item: any) => {
            item.list_permission = JSON.parse('{"View": false, "Add": false, "Edit": false, "Delete": false, "ShowColumns": false}');
            item.sub_system_code = item.menu_code;
            item.State = me.$ms.constant.FormState.Add;
          });
        }
        else if (me._formParam.dataRow){
          let roleDetails: any [] = [];
          if (me._formParam.dataRow.RoleDetail?.length){
            roleDetails = me._formParam.dataRow.RoleDetail;
          }
          allMenu.forEach((item: any) => {
            item.list_permission = JSON.parse('{"View": false, "Add": false, "Edit": false, "Delete": false, "ShowColumns": false}');
            item.sub_system_code = item.menu_code;
            item.State = me.$ms.constant.FormState.Add;
            const itemEdit = roleDetails.find(_ => _.sub_system_code == item.sub_system_code);
            if(itemEdit){
              item.State = me.$ms.constant.FormState.Edit;
              item.role_detail_id = itemEdit.role_detail_id;
              item.role_id = itemEdit.role_id;
              item.list_permission = JSON.parse(itemEdit.list_permission);
              item.created_date = itemEdit.created_date;
              item.created_by = itemEdit.created_by;
            }
          });
        }
        me._formParam.dataRow.RoleDetail = allMenu;
      }
		};

    /**
     * Xử lý dữ liệu trước khi save
     * @override
     */
    const beforeSave = async (model) => {
      const me: any = proxy;
      if(model?.RoleDetail?.length){
        model.RoleDetail = model.RoleDetail.filter((_: any) => !_.is_parent);
        model.RoleDetail.forEach((roleDetail) => {
          roleDetail.list_permission = JSON.stringify(roleDetail.list_permission);
        });
      }
    };

    /**
     * Nút check box all quyền có đang được check từng row
     */
    const allPermissionRow = (row: any) => {
      return row.list_permission.View && row.list_permission.Add && row.list_permission.Edit && row.list_permission.Delete && row.list_permission.ShowColumns;
    };

    /**
     * Xử lý check quyền all cho 1 row
     * @param row 
     */
    const changeCheckedAllPermissionRow = (row: any) => {
      let value = true;
      if(allPermissionRow(row)){
        value = false;
      }
      row.list_permission.View = value;
      row.list_permission.Add = value;
      row.list_permission.Edit = value;
      row.list_permission.Delete = value;
      row.list_permission.ShowColumns = value;
    };

    /**
     * Load toàn bộ menu về phân quyền theo menu
     */
     const loadAllMenu = async () => {
      const me = proxy;
      let allMenu: any [] = [];
      const payload = {
        "PageIndex": 0,
        "PageSize": 0,
        "Columns": "*",
        "Filter": '',
        "Sort": "",
        "CustomParam": {}
      };
      me.$ms.commonFn.mask();
      const result = await menuAPI.getList(payload);
      me.$ms.commonFn.unmask();
      if(result?.Success && result?.Data?.PageData?.length){
        allMenu = result.Data.PageData;
      }
      return allMenu;
    };
    
    /**
     * Layout grid
     */
    const column: any [] = [
      {
        "lock": false,
        "type": "custom",
        "width": 300,
        "header": "",
        "dataField": "menu_code",
        "formatType": 12,
        "headerCustom": "",
        "visible": true
      },
      {
        "lock": false,
        "width": 120,
        "header": "i18nRole.SubSystem.All",
        "dataField": "All",
        "formatType": 12,
        "headerCustom": "",
        "type": "custom",
        "visible": true
      },
      {
        "lock": false,
        "width": 120,
        "header": "i18nRole.SubSystem.View",
        "dataField": "View",
        "formatType": 12,
        "headerCustom": "",
        "type": "custom",
        "visible": true
      },
      {
        "lock": false,
        "width": 120,
        "header": "i18nRole.SubSystem.Add",
        "dataField": "Add",
        "formatType": 12,
        "headerCustom": "",
        "type": "custom",
        "visible": true
      },
      {
        "lock": false,
        "width": 120,
        "header": "i18nRole.SubSystem.Edit",
        "dataField": "Edit",
        "formatType": 12,
        "headerCustom": "",
        "type": "custom",
        "visible": true
      },
      {
        "lock": false,
        "width": 120,
        "header": "i18nRole.SubSystem.Delete",
        "dataField": "Delete",
        "formatType": 12,
        "headerCustom": "",
        "type": "custom",
        "visible": true
      },
      {
        "lock": false,
        "width": 120,
        "header": "i18nRole.SubSystem.ShowColumns",
        "dataField": "ShowColumns",
        "formatType": 12,
        "headerCustom": "",
        "type": "custom",
        "visible": true
      },
      {
        "lock": false,
        "header": "",
        "dataField": "",
        "formatType": 12,
        "headerCustom": "",
        "type": "custom",
        "visible": true
      },
    ];
		
		return {
			api,
      column,
			storeModule,
      subSystemCode,
      beforeSave,
			beforeBindData,
      allPermissionRow,
      changeCheckedAllPermissionRow,
		};
	},
});
</script>

<style lang="scss" scoped>
:deep(.vfm__content.modal-content){
  background-color: #ebebeb;
}
:deep(.table-scroll){
  padding: 0;
  background-color: #fff;
}
:deep(.table .thead-light th){
  background-color: #fff !important;
  height: 30px !important;
  span{
    text-align: center;
    line-height: 24px !important;
  }
}
:deep(.table tbody td:first-child){
  position: unset;
}
:deep(.table tbody td){
  height: 32px !important;
}
:deep(.ms-grid-tree){
  height: calc(100% - 32px);
}
:deep(.table tbody td:last-child::before){
  content: unset;
  right: unset;
  top: unset;
  width: 0;
  height: 0;
  position: unset;
}
.form-content-popup{
  height: 100%;
  .form-container{
    height: 100%;
  }
}
.form-action_container{
  padding: 8px 0;
}
.form-group{
  margin-right: 12px;
  width: 300px;
  padding-bottom: 4px;
  &:first-child{
    width: 200px;
  }
  &:last-child{
    width: 500px;
  }
}
.decentralization {
  height: calc(100% - 69px);
  display: flex;
  .left-menu{
    width: 250px;
    padding: 16px;
    background-color: #fff;
    border-radius: 2px;
    margin-right: 16px;
    .title-menu{
      font-size: 15px;
      font-weight: 700;
    }
    .list-menu{
      padding-top: 6px;
      .box-item{
        border: 1px solid #e0e0e0;
        border-radius: 2px;
        padding: 8px 12px;
        align-items: center;
        margin-top: 8px;
        font-weight: 500;
        cursor: pointer;
      }
      .box-item.active{
        border-color: var(--primary__color);
        background-color: var(--primary__color-background);
        color: var(--primary__color);
      }
    }
  }
  .container{
    padding: 16px;
    background-color: #fff;
    border-radius: 2px;
    height: calc(100vh - 232px);
    .row-header{
      align-items: center;
      margin-bottom: 12px;
    }
    .decentralization-container{
      height: 100%;

    }
    .item-checkbox{
      width: 100%;
    }
    .collapse-item-con{
      border: 1px solid #e0e0e0;
      height: 100%;
      .ms-collapse-item--header{
        font-size: 15px;
        font-weight: 700;
        padding: 6px 8px;
        background-color: #eceef1;
        .collapse-header-title{
          
        }
      }
      .ms-collapse-item--content{
        height: 100%;
      }
    }
  }
}
</style>
