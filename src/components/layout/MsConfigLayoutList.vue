 <template>
	<ms-dynamic-popup 
    dockPosition="right"
    :width="850"
    :title="$t('i18nCommon.customize_interface')"
    @beforeOpen="beforeOpen"
  >
		<template v-slot:content="{ close }">
      <div class="setting-content">
        <div class="setting-name setting-header_name">
          <div style="padding-left: 26px;">
            <ms-checkbox
              :checked="showAll"
              @custom-handle-click-checkbox="handleClickCheckAll"
            ></ms-checkbox>
          </div>
          <div style="padding-left: 19px;" class="info-setting">{{ $t('i18nControl.MsGridViewer.name_column') }}</div>
          <div class="info-setting name-custom">{{ $t('i18nControl.MsGridViewer.name_column_custom') }}</div>
          <div style="padding-left: 45px;" >{{ $t('i18nControl.MsGridViewer.width') }}</div>
          <div style="padding-left: 45px;" >{{ $t('i18nControl.MsGridViewer.fixed_col') }}</div>
        </div>
        <draggable
          :list="columns"
          :disabled="!true"
          item-key="Field"
          class="list-group"
          ghost-class="ghost"
          @start="dragging = true"
          @end="dragging = false"
        >
          <template #item="{ element }">
            <div class="list-group-item setting-name" :class="{ 'not-draggable': !true }">
              <div :title="$t('i18nControl.MsGridViewer.drag')" class="icon-drag-grid"></div>
              <ms-checkbox
                v-model="element.visible"
              ></ms-checkbox>
              <div class="info-setting">{{ $t(element.header) }}</div>
              <input v-model="element.headerCustom" class="input input-setting" type="text" />
              <input @keypress="isInputNumber($event, element.width)" v-model="element.width" class="input input-setting_width" type="text" />
              <ms-checkbox class="fix-column"
                v-model="element.lock"
              ></ms-checkbox>
            </div>
          </template>
        </draggable>
      </div>
		</template>
    <template v-slot:footer="{ close }">
      <div class="setting-footer">
          <ms-button @click="close" class="btn">{{ $t('i18nCommon.Close') }}</ms-button>
          <ms-button @click="saveLayout" class="btn primary">
            {{ $t('i18nCommon.crud.save') }}
          </ms-button>
        </div>
		</template>
	</ms-dynamic-popup>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref, computed } from 'vue';
import draggable from "vuedraggable";
import layoutAPI from '@/apis/dictionary/layoutAPI';
import memoryCache from '@/cache/memoryCache';

export default defineComponent({
	props: {},
	components: {
    draggable,
	},
	setup() {
		const { proxy }: any = getCurrentInstance();
    const columns = ref([]); // cấu hình cột
    const dragging = ref(false);

    /**
     * Xử lý khi mở popup
     */
    const beforeOpen = (e: any) => {
      const me: any = proxy;
      me._popup = me.$vfm.dynamicModals[me.$vfm.dynamicModals.length - 1];
			me._formParam = e.ref.params._rawValue ? e.ref.params._rawValue : e.ref.params;
      me.editMode = me._formParam.formState;
      columns.value = me._formParam.columns;
    };

    /**
     * Lưu lại cấu hình layout
     */
    const saveLayout = async () => {
      const me: any = proxy;
      if(typeof me._formParam?.initLayout === 'function' && me._formParam.layoutTag){
        columns.value.forEach((col: any) => {
          if(!col.width){
            col.width = 200; // nếu ko điền width thì mặc định cấu hình cho 200px
          }
        })
        me._formParam.initLayout(columns.value);
        memoryCache.set(`Layout${me._formParam.layoutTag}`, columns.value);
        memoryCache.set(`Layout${me._formParam.layoutTag}Edit`, JSON.parse(JSON.stringify(columns.value))); // Cache lại thêm cấu hình layout để tuỳ chỉnh giao diện ko liên quan đến grid
        layoutAPI.updateLayoutByTag(me._formParam.layoutTag, JSON.stringify(columns.value));
      }
      hide();
    };

    /**
		 * Đóng form
		 */
		const hide = () => {
			try {
				const me: any = proxy;
				me._popup.value = false;
				me.$nextTick(() => {
					delete me._popup;
				});
			} catch (ex) {
				console.error(ex)
			}
		};

    /**
     * Xử lý nhập liệu ô width
     */
    const isInputNumber = (evt: any, width: any) => {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57 || width > 999)) && charCode !== 46) {
        evt.preventDefault();
      } else {
        return true;
      }
    }

    /**
     * Có show all hay không
     */
    const showAll = computed(() => {
      if(columns.value.find((item: any) => !item.visible)){
        return false;
      }
      else{
        return true;
      }
    });

    /**
     * Hàm xử lý toggle all các checkbox
     */
    const handleClickCheckAll = () => {
      if(showAll.value){
        columns.value.forEach((item: any) => {
          item.visible = false;
        })
      }
      else{
        columns.value.forEach((item: any) => {
          item.visible = true;
        })
      }
    }

		return {
      columns,
      dragging,
      showAll,
      handleClickCheckAll,
      beforeOpen,
      isInputNumber,
      saveLayout,
		};
	}
});
</script>

<style lang="scss" scoped>
::-webkit-scrollbar-track {
  border-radius: 0;
  direction: rtl;
}

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
.modal {
  top: 0;
}
.modal-body.modal-setting_container {
  width: 800px;
  height: 100%;
  margin: 0;
  left: calc(100%);
  top: 0;
  transform: none;
  padding: 0 16px;
  transition: all ease 0.15s;
}
.modal-setting.active .modal-body.modal-setting_container {
  left: calc(100% - 800px);
}
.modal-setting {
  z-index: 15;
}

.modal-setting_content {
  display: flex;
  height: 100%;
  flex-direction: column;
}
.setting-header {
  display: flex;
  height: 64px;
  justify-content: space-between;
}
.setting-header h1 {
  padding: 12px 0 16px 0;
}
.setting-header_icon {
  background: var(--url__icon) no-repeat;
  background-position: -144px -144px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  margin-top: 12px;
}

.setting-content {
  overflow: auto;
  width: 100%;
  height: calc(100vh - 120px);
  padding: 0 20px;
}
.setting-name {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-bottom: 1px solid #c7c7c7;
}
.setting-name:hover {
  background-color: #f2f9ff;
}
.active.setting-name {
  background-color: #e5f3ff;
}
.setting-header_name {
  border-bottom: 2px solid #c7c7c7;
  background-color: #e5e8ec;
  font-family: "notosans-semibold";
}
.setting-header_name:hover {
  background-color: #e5e8ec;
}
.info-setting {
  padding-left: 20px;
  max-width: 260px;
  min-width: 260px;
  width: 260px;
}
.info-setting.name-custom{
  max-width: 210px;
  min-width: 210px;
  width: 210px;
}
.setting-header_name .info-setting {
  padding-left: 0;
}
.setting-footer {
  display: flex;
  padding: 11px 0;
  align-items: center;
  height: 56px;
  justify-content: space-between;
  border-top: 4px solid #f4f5f8;
  width: 100%;
}
.input-setting{
  width: 200px;
  height: 26px;
}
.input-setting_width{
  height: 26px;
  width: 60px;
  margin-left: 55px;
}
.icon-drag-grid{
  width: 16px;
  height: 16px;
  min-width: 16px;
  min-height: 16px;
  background: var(--url__icon) no-repeat;
  cursor: pointer;
  background-position: -416px -360px;
  margin-right: 10px;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.fix-column{
  margin-left: 65px;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
