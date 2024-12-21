<template>
	<ms-dynamic-popup 
		:width="500" 
		:height="204" 
		:title="$t('i18nCommon.SettingDisplay')"
    @beforeOpen="beforeOpen"
	>
		<template v-slot:content="{ close }">
			<div ref="slot-content" class="form-content-popup">
				<div class="form-container">
          <span class="title">{{ $t('i18nControl.MsGridViewer.ques_setting_clamp') }}</span>
          <div class="ms-radio_item">
            <ms-radio
              :label="`1 ${$t('i18nControl.MsGridViewer.line')}`"
              :value="'hidden-space_1'"
              v-model="lineClampModel"
            ></ms-radio>
            <ms-radio
              :label="`2 ${$t('i18nControl.MsGridViewer.line')}`"
              :value="'hidden-space_2'"
              v-model="lineClampModel"
            ></ms-radio>
            <ms-radio
              :label="`3 ${$t('i18nControl.MsGridViewer.line')}`"
              :value="'hidden-space_3'"
              v-model="lineClampModel"
            ></ms-radio>
            <ms-radio
              :label="`${$t('i18nControl.MsGridViewer.unlimited')}`"
              :value="''"
              v-model="lineClampModel"
            ></ms-radio>
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
import { defineComponent, getCurrentInstance, ref, onBeforeMount } from 'vue';
import EventBusGlobal, { GlobalEventName } from "@/commons/eventBusGlobal";

export default defineComponent({
	setup() {
		const { proxy }: any = getCurrentInstance(); // Instance của component
    const lineClampModel = ref<any>(''); // chế độ ẩn dòng khi xuống dòng của table giá trị v-model
    onBeforeMount(() => {
      let lineClamp = localStorage.getItem('lineClamp');
      if(lineClamp || lineClamp == ''){
        lineClampModel.value = lineClamp;
      }
      else{
        lineClampModel.value = 'hidden-space_1';
      }
    });

    /**
     * Thực hiện lưu
     */
		const save = () => {
      localStorage.setItem('lineClamp', lineClampModel.value);
      EventBusGlobal.$emit(GlobalEventName.updateTheSettingClamp, lineClampModel.value);
      hide();
    };

    /**
     * Xử lý khi mở popup
     */
    const beforeOpen = (e: any) => {
      const me: any = proxy;
      me._popup = me.$vfm.dynamicModals[me.$vfm.dynamicModals.length - 1];
      me._formParam = e.ref.params._rawValue ? e.ref.params._rawValue : e.ref.params;
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

		return {
      lineClampModel,
      save,
      beforeOpen,
		};
	},
});
</script>

<style lang="scss" scoped>
.form-container .title {
  display: inline-block;
  margin: 0 0 10px 0;
}
</style>
