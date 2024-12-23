<template>
	<ms-dynamic-popup 
		:width="1000" 
		:height="600" 
		:title="`${editMode ? $ms.commonFn.getEnumResource(editMode ,'FormState') : ''} ${$t('i18nUser.Title')}`" 
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
										:label="$t('i18nUser.Detail.user_name')"
										:rules="[{ name: 'required' }, ]"
										v-model="model.user_name"
									></ms-input>
								</div>
								<div class="form-group ms-big">
									<ms-input
										:maxLength="150"
										:label="$t('i18nUser.Detail.user_full_name')" 
										:rules="[{ name: 'required' }, ]"
										v-model="model.user_full_name"
									></ms-input>
								</div>
							</div>
							<div class="form-group">
								<ms-input
									:maxLength="13"
									:label="$t('i18nUser.Detail.phone_number')"
									:rules="[{ name: 'pattern', compareValue: 'phone' }, ]"
									v-model="model.phone_number"
								></ms-input>
							</div>
						</div>
						<div class="form-item">
							<div class="form-item_input">
								<div class="form-group ms-small">
									<ms-datepicker
										:label="$t('i18nUser.Detail.date_of_birth')"
										:max="new Date()"
										:rules="[{ name: 'required' }, ]"
										v-model="model.date_of_birth"
									>
									</ms-datepicker>
								</div>
								<div style="padding-left: 16px" class="form-group ms-big">
									<label>{{ $t('i18nUser.Detail.gender') }}</label>
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
                    :maxLength="50"
                    :label="$t('i18nUser.Detail.email')"
										:rules="[{ name: 'pattern', compareValue: 'email' }, ]"
                    v-model="model.email"
                  ></ms-input>
								</div>
							</div>
						</div>
					</div>
					<div class="form-detail flex form-select-option">
						<div class="form-item form-detail-role">
							<label class="select-title">{{ $t('i18nRole.SelectRole') }}:</label>
							<div 
								class="role-item"
								v-for="role in comboBoxDataRemote.role_code"
								:key="role.role_id"
							>
								<ms-checkbox
									v-model="role.checked"
								>
									<div class="info-checkbox"><span class="bold">{{ role.role_code }}</span>: {{ role.role_name }}</div>
								</ms-checkbox>
							</div>
						</div>
						<div class="form-item select-image">
							<label class="select-title">{{ $t('i18nUser.Detail.avartar') }}:</label>
							<ms-file-image
								v-model="model.avartar"
								:path="'/user/avatar'"
							></ms-file-image>
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
import { defineComponent, getCurrentInstance, reactive, ref } from 'vue';
import useModuleUser from '@/stores/system/moduleUser';
import userAPI from '@/apis/system/userAPI'
import BaseDetail from '@/views/base/BaseDetail'
import roleAPI from '@/apis/system/roleAPI';
import MsFileImage from '@/components/file/MsFileImage.vue';

export default defineComponent({
	mixins: [],
	components: {
		MsFileImage,
	},
	extends: BaseDetail,
	setup() {
		const { proxy }: any = getCurrentInstance(); // Instance của component
		const storeModule: any = useModuleUser(); // Cấu hình store
		const api = ref(userAPI); // Cấu hình api
    const subSystemCode = ref('user'); // Cấu hình phân quyền
		const comboBoxDataRemote = reactive({
      role_code: [],
    });

		/**
		 * Xử lý dữ liệu trước khi binding
		 * @override
		 */
		const beforeBindData = async () => {
			const me: any = proxy;
			await loadAllRole();
			await me.super('beforeBindData', BaseDetail);
			if(me._formParam.dataRow && me.editMode == me.$ms.constant.FormState.Add){
				me._formParam.dataRow.gender = me.$ms.constant.Gender.Male;
			}
			if(me._formParam.dataRow?.UserJoinRoleDetail?.length){
				me._formParam.dataRow.UserJoinRoleDetail.forEach(role => {
					const roleExist = comboBoxDataRemote.role_code.find(_ => _.role_id == role.role_id);
					if(roleExist){
						roleExist.checked = true;
					}
				});
			}
		};

		/**
     * Xử lý dữ liệu trước khi save
     * @override
     */
		 const beforeSave = async (model) => {
      const me: any = proxy;
			if(!model.UserJoinRoleDetail){
				model.UserJoinRoleDetail = [];
			}
			model.UserJoinRoleDetail.forEach(_ => {
				_.State = me.$ms.constant.FormState.Delete;
			});
			comboBoxDataRemote.role_code.forEach((role) => {
				if(role.checked){
					model.UserJoinRoleDetail.push({
						State: me.$ms.constant.FormState.Add,
						role_id: role.role_id,
					});
				}
			});
    };

		/**
		 * Load toàn bộ quyền về
		 */
		const loadAllRole = async () => {
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
      const result = await roleAPI.getList(payload);
      me.$ms.commonFn.unmask();
      if(result?.Success && result?.Data?.PageData?.length){
        comboBoxDataRemote.role_code = result.Data.PageData.sort((a, b) => {
					return b.is_administrator - a.is_administrator;
				});
      }
		};
		
		return {
			api,
			storeModule,
			subSystemCode,
			comboBoxDataRemote,
			beforeBindData,
			beforeSave,
		};
	},
});
</script>

<style lang="scss" scoped>
.role-item{
	margin-bottom: 8px;
}
.form-select-option{
	max-height: 212px;
	overflow: auto;
}
.form-detail-role, .select-image{
	.select-title{
		font-family: "notosans-semibold";
    margin-bottom: 8px;
		font-size: 12px;
    white-space: nowrap;
		display: block;
	}
}
.form-detail:first-child{
	padding-bottom: 0;
}
</style>
