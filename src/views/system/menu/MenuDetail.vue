<template>
	<ms-dynamic-popup 
		:width="600" 
		:height="420" 
		:title="`${editMode ? $ms.commonFn.getEnumResource(editMode ,'FormState') : ''} ${$t('i18nMenu.Title')}`" 
		@beforeOpen="beforeOpen"
	>
		<template v-slot:content="{ close }">
			<div ref="slot-content" class="form-content-popup">
				<div class="form-container">
					<div class="form-detail flex-center">
						<div class="form-item">
							<div class="form-item_input">
								<div class="form-group ms-small">
									<ms-input
										:maxLength="30"
										:label="$t('i18nMenu.Detail.menu_code')" 
										v-model="model.menu_code"
									></ms-input>
								</div>
								<div class="form-group ms-big">
									<ms-input
										:maxLength="150"
										:label="$t('i18nMenu.Detail.menu_name')" 
										v-model="model.menu_name"
									></ms-input>
								</div>
							</div>
              <div class="form-item_input">
                <div class="form-group ms-small">
                  <ms-input
                    :maxLength="50"
                    :label="$t('i18nMenu.Detail.icon')" 
                    v-model="model.icon"
                  ></ms-input>
                </div>
                <div class="form-group ms-big">
                  <ms-input
                    :maxLength="150"
                    :label="$t('i18nMenu.Detail.url')" 
                    v-model="model.url"
                  ></ms-input>
                </div>
              </div>
              <div class="form-item_input">
                <div class="form-group">
                  <ms-combobox-tree
                    :label="$t('i18nMenu.Detail.parent')"
                    :data="comboBoxDataRemote.menu_code"
                    :value="'menu_id'"
                    :idField="'menu_id'"
                    :header="'menu_name'"
                    v-model="model.parent_id"
                  ></ms-combobox-tree>
                </div>
              </div>
							<div class="form-item_input">
								<div class="form-group ms-big">
                  <div class="form-group ms-small">
                    <ms-number
                      :label="$t('i18nMenu.Detail.sort')" 
                      v-model="model.sort"
                    ></ms-number>
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
import { defineComponent, getCurrentInstance, ref, reactive } from 'vue';
import useModuleMenu from '@/stores/system/moduleMenu';
import menuAPI from '@/apis/system/menuAPI'
import BaseDetail from '@/views/base/BaseDetail'
import MsComboboxTree from '@/components/comboboxTree/MsComboboxTree.vue';

export default defineComponent({
	mixins: [],
	components: {
    MsComboboxTree,
	},
	extends: BaseDetail,
	setup() {
		const { proxy }: any = getCurrentInstance(); // Instance của component
		const storeModule: any = useModuleMenu(); // Cấu hình store
		const api = ref(menuAPI); // Cấu hình api
    const subSystemCode = ref('menu'); // Cấu hình phân quyền
    const comboBoxDataRemote = reactive({
      menu_code: [],
    });

    /**
     * Load menu về để chọn cha
     */
    const loadMenuParent = async () => {
      const me: any = proxy;
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
        if(me.editMode == me.$ms.constant.FormState.Add){
          comboBoxDataRemote.menu_code = result.Data.PageData;
        }
        else{
          comboBoxDataRemote.menu_code = me.$ms.commonFn.deleteHierarchyTree(result.Data.PageData, 'parent_id', 'menu_id', me._formParam.dataRow.menu_id);
        }
      }
    };

		/**
		 * Xử lý dữ liệu trước khi binding
		 * @override
		 */
		const beforeBindData = async () => {
			const me: any = proxy;
      await loadMenuParent();
			await me.super('beforeBindData', BaseDetail);
		};
		
		return {
			api,
			storeModule,
      subSystemCode,
      comboBoxDataRemote,
			beforeBindData,
		};
	},
});
</script>

<style lang="scss" scoped>
.form-item{
  width: 100%;
}
</style>
