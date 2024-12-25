<template>
	<div style="width: 100%; height: 100%; padding: 10px 24px;">
		<div id="id-dashboard" @click="show">
			Trang chủ nhân viên {{ $ms.constant.Gender.Other }}
		</div>
		<div style="width: 1000px; display: flex; margin-bottom: 6px;">
			<ms-datepicker
				v-model="datePicker"
			>
			</ms-datepicker>
		</div>
		<div style="width: 200px; display: flex; margin-bottom: 6px;">
			<ms-input v-model="msInput"/> Value: {{ msInput }}
		</div>
		<div style="width: 200px; display: flex; margin-bottom: 6px;">
			<ms-textarea v-model="msInput"/> Value: {{ msInput }}
		</div>
		<div style="width: 200px; display: flex; margin-bottom: 6px;">
			<ms-number v-model="msNumber"/> Value: {{ msNumber }}
		</div>
		<div style="width: 200px; display: flex; margin-bottom: 6px;">
			<ms-checkbox v-model="msCheckbox"/> Value: {{ msCheckbox }}
		</div>
		<div style="width: 200px; display: flex; margin-bottom: 6px;">
			<ms-switch v-model="msCheckbox"/> Value: {{ msCheckbox }}
		</div>
		<div style="width: 1000px; display: flex; margin-bottom: 6px;">
			<label>{{ "Giới tính: " }}</label>
				<div class="base-radio_item">
					<ms-radio	
						:label="'Nam'"
						:value="0"
						v-model.number="gender"
					></ms-radio>
					<ms-radio
						:label="'Nữ'"
						:value="1"
						v-model.number="gender"
					></ms-radio>
					<ms-radio
						:label="'Khác'"
						:value="2"
						v-model.number="gender"
					></ms-radio>
				</div>
				<div style="margin-left: 20px;">Value: {{ gender }}</div>
		</div>
		<div style="width: 1000px; display: flex; margin-bottom: 6px;">
			<ms-button @click="addNotification">addNotification</ms-button>

			<ms-button @click="showInfoFn">showInfo</ms-button>
			<ms-button @click="showAlertFn">showAlert</ms-button>
			<ms-button @click="showConfirmFn">showConfirm</ms-button>
			<ms-button @click="showErrorFn">showError</ms-button>
			<ms-button @click="showWarningFn">showWarning</ms-button>
		</div>
		<div style="height: 400px;">
			<ms-froala
				v-model="model"
				:pathImage="'/news/handbook/image'"
				:pathVideo="'/news/handbook/video'"
			/>
		</div>
		<div style="height: 400px;">
			<ms-froala-view v-model="model"></ms-froala-view>
		</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref } from 'vue';
import popupUtil from '@/commons/popupUtil';
import useModuleEmployee from '@/stores/dictionary/moduleEmployee';
import employeeAPI from '@/apis/dictionary/employeeAPI';
import MsFroala from '@/components/froala/MsFroala.vue';
import { showInfo, showAlert, showConfirm, showError, showWarning } from '@/commons/globalMessage';
import MsFroalaView from '@/components/froala/MsFroalaView.vue';

export default defineComponent({
  components: {
		MsFroala,
		MsFroalaView,
  },
	setup() {
		const { proxy } : any = getCurrentInstance();

		const datePicker = ref(new Date());
		const msInput  = ref();
		const msNumber  = ref();
		const msCheckbox  = ref(true);
		const gender  = ref(0);
		const model = ref(null);

		const storeModule: any = useModuleEmployee();

		const showInfoFn = async () => {
			popupUtil.show('EmployeeDetail');
			const me: any = proxy;
			const result = await showInfo('showInfoFn');
			console.log(result)
		};
		const showAlertFn = async () => {
			const me: any = proxy;
			const result = await showAlert('showAlertFn');
			console.log(result)
		};
		const showConfirmFn = async () => {
			const me: any = proxy;
			const result = await showConfirm('showConfirmFn');
			console.log(result)
		};
		const showErrorFn = async () => {
			const me: any = proxy;
			const result = await showError('showErrorFn');
			console.log(result)
		};
		const showWarningFn = async () => {
			const me: any = proxy;
			const result = await showWarning('showWarningFn');
			console.log(result)
		};


    const show = async () => {
      const me = proxy;
      // popupUtil.show('EmployeeDetail');

      console.log(me.$ms.commonFn.getEnumSource("Gender"));
      me.$ms.commonFn.mask();
      let test = await employeeAPI.getEdit({
        id: '616cd111-ae1d-4ad7-8a59-2a9a5d1ac693',
      });
      console.log(test);
      me.$ms.commonFn.unmask();

    }

		const addNotification = () => {
			const me: any = proxy;
			me.$ms.commonFn.pushNotification({
				type: me.$ms.constant.ENotificationType.Success,
				message: "Thành công opacity: 0; visibility: hidden; z-index: -1; position: fixed; bottom: 55px; width: 84px; height: 84px; max-width: 100%; max-height: calc(100% - 55px); min-height: 0px; min-width: 0px; background-color: transparent; border: 0px; overflow: hidden; right: 2px; transition: none !important;",
			});
		}

		return {
			show,
			addNotification,
			datePicker,
			msInput,
			msNumber,
			msCheckbox,
			gender,
			model,
			showInfoFn,
			showAlertFn,
			showConfirmFn,
			showErrorFn,
			showWarningFn,
		};
	},
});
</script>

<style lang="scss" scoped>

</style>
