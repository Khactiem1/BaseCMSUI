<template>
	<ms-dynamic-popup 
		:width="1074" 
		:height="606" 
		:title="`${editMode ? $ms.commonFn.getEnumResource(editMode ,'FormState') : ''} ${$t('i18nEmployee.Title')}`" 
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
										:maxLength="100"
										:label="$t('i18nEmployee.Detail.employee_code')" 
										v-model="model.employee_code"
									></ms-input>
								</div>
								<div class="form-group ms-big">
									<ms-input
										:maxLength="255"
										:label="$t('i18nEmployee.Detail.employee_name')" 
										v-model="model.employee_name"
									></ms-input>
								</div>
							</div>
							<div class="form-group">
								<ms-input
									:maxLength="255"
									:label="$t('i18nEmployee.Detail.employee_title')" 
									v-model="model.employee_title"
								></ms-input>
							</div>
							<div class="form-group">
								<ms-number
									:label="$t('i18nEmployee.Detail.money')" 
									v-model="model.money"
								></ms-number>
							</div>
						</div>
						<div class="form-item">
							<div class="form-item_input">
								<div class="form-group ms-small">
									<ms-datepicker
										:label="$t('i18nEmployee.Detail.date_of_birth')"
										:maxDate="new Date()"
										v-model="model.date_of_birth"
									>
									</ms-datepicker>
								</div>
								<div style="padding-left: 16px" class="form-group ms-big">
									<label>{{ $t('i18nEmployee.Detail.gender') }}</label>
									<div class="ms-radio_item">
										<ms-radio
											:label="$t('i18nEnum.Gender.Male')"
											:value="$ms.constant.Gender.Male"
											v-model.number="model.gender"
										></ms-radio>
										<ms-radio
											:label="$t('i18nEnum.Gender.Female')"
											:value="$ms.constant.Gender.Female"
											v-model.number="model.gender"
										></ms-radio>
										<ms-radio
											:label="$t('i18nEnum.Gender.Other')"
											:value="$ms.constant.Gender.Other"
											v-model.number="model.gender"
										></ms-radio>
									</div>
								</div>
							</div>
							<div class="form-item_input">
								<div class="form-group ms-big">
									<ms-input
										:maxLength="255"
										:label="$t('i18nEmployee.Detail.identity_card')"
										v-model="model.identity_card"
									></ms-input>
								</div>
							</div>
							<div class="form-item_input">
								<div class="form-group ms-big">
									<ms-input
										:maxLength="255"
										:label="$t('i18nEmployee.Detail.employee_address')"
										v-model="model.employee_address"
									></ms-input>
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
import useModuleEmployee from '@/stores/dictionary/moduleEmployee';
import employeeAPI from '@/apis/dictionary/employeeAPI'
import BaseDetail from '@/views/base/BaseDetail'

export default defineComponent({
	mixins: [],
	components: {

	},
	extends: BaseDetail,
	setup() {
		const { proxy }: any = getCurrentInstance(); // Instance của component
		const storeModule: any = useModuleEmployee(); // Cấu hình store
		const api = ref(employeeAPI); // Cấu hình api

		/**
		 * Xử lý dữ liệu trước khi binding
		 * @override
		 */
		const beforeBindData = async () => {
			const me: any = proxy;
			await me.super('beforeBindData', BaseDetail);
			if(me._formParam.dataRow && me.editMode == me.$ms.constant.FormState.Add){
				me._formParam.dataRow.gender = me.$ms.constant.Gender.Male;
			}
		};
		
		return {
			api,
			storeModule,
			beforeBindData,
		};
	},
});
</script>

<style lang="scss" scoped>

</style>
