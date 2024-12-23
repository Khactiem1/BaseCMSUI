import { mixinSuper } from '@/mixins/common/mixinSuper';
import { permission } from '@/mixins/common/permission';
import { showError, showAlert } from '@/commons/globalMessage';
import { cloneDeep } from 'lodash-es';

/**
 * Các thông tin chung của màn hình chi tiết
 */
export default {
	mixins: [mixinSuper, permission],
	data() {
		return {
      /**
			 * refname control hiển thị dữ liệu: grid/tree
			 */
			viewRef: 'viewList',
			/**
			 * Store của module kế thừa base
			 */
			storeModule: {},

			/**
			 * api của module
			 */
			api: {},

      /**
       * Trạng thái from
       */
      editMode: null,

      /**
       * Dữ liệu thực hiện binding
       */
      model: {} as any,

      /**
       * Param từ form mở popup đẩy lên
       */
      _formParam: {},

      /**
       * Sau khi save có đóng form ko
       */
      hideAfterSave: true,
		};
	},
	created() {},
	mounted() {
    const me: any = this;
    me.bindData();
    me.addObserveControl();
	},
	/**
	 * Xóa items trong grid khi unmount
	 */
	beforeUnmount() {

	},
	methods: {
    /**
     * Xử lý trước khi bind dữ liệu
     */
    async beforeBindData(){
      
    },

    /**
     * Xử lý bind dữ liệu
     */
    async bindData(){
      const me: any = this;
      await me.beforeBindData();
      me.model = me._formParam.dataRow;
      if(me.editMode == me.$ms.constant.FormState.Add){ // nếu là model add thì reset khoá chính
        delete me.model[me.storeModule._config.field.key];
      }
      setTimeout(() => {
        me.$ms.commonFn.focusFirstControl(me.$refs['slot-content']);
      }, 100);
    },

    /**
     * Xử lý khi mở popup
     */
    beforeOpen(e: any){
      const me: any = this;
      me._popup = me.$vfm.dynamicModals[me.$vfm.dynamicModals.length - 1];
			me._formParam = e.ref.params._rawValue ? e.ref.params._rawValue : e.ref.params;
      me.editMode = me._formParam.formState;
    },

    /**
		 * Đóng form nhưng không kiểm tra thay đổi
		 */
		hide() {
			try {
				const me: any = this;
				me._popup.value = false;

				me.$nextTick(() => {
					delete me._popup;
				});
			} catch (ex) {
				console.error(ex)
			}
		},

    /**
     * Hàm xử lý thêm dữ liệu trùng với dữ liệu đã xoá
     */
    async handleDuplicateDataDelete(){
      const me: any = this;
      const ask = await showAlert(me.$t('i18nCommon.AskRestoreDuplicateData'));
      if(ask){
        me.$ms.commonFn.mask();
        const result = await me.api.restoreDataDelete(me.model);
        me.$ms.commonFn.unmask();
        if(result?.Success && result?.Data){
          me.model[me.storeModule._config.field.key] = result.Data[me.storeModule._config.field.key];
          me.storeModule.insertItem(me.model);
          me.editMode = me.$ms.constant.FormState.Edit;
          me.$ms.commonFn.pushNotification({
            type: me.$ms.constant.ENotificationType.Success,
            message: me.$t('i18nCommon.crud.restore_success'),
          });
        }
      }
    },

    /**
     * Xử lý cất dữ liệu
     */
    async save(){
      const me: any = this;
      const dataSubmit = cloneDeep(me.model);
      await me.beforeSave(dataSubmit);
      if(await me.validateSave()){
        let saveSuccess = false;
        me.$ms.commonFn.mask();
        switch (me.editMode) {
          case me.$ms.constant.FormState.Add:
            const resultSave = await me.storeModule.insert(dataSubmit);
            if (resultSave?.Success){
              me.$ms.commonFn.pushNotification({
                type: me.$ms.constant.ENotificationType.Success,
                message: me.$t('i18nCommon.crud.save_success'),
              });
              saveSuccess = true;
            }
            else if (resultSave.Code == me.$ms.constant.EnumValidateResult.DuplicateDelete){
              await me.handleDuplicateDataDelete();
            }
            break;
          case me.$ms.constant.FormState.Edit:
            const resultEdit = await me.storeModule.update(dataSubmit);
            if (resultEdit?.Success){
              me.$ms.commonFn.pushNotification({
                type: me.$ms.constant.ENotificationType.Success,
                message: me.$t('i18nCommon.crud.edit_success'),
              });
              saveSuccess = true;
            }
            break;
        }
        if(saveSuccess){
          await me.afterSaveSuccess();
          if(me.hideAfterSave){
            me.hide();
          }
        }
        me.$ms.commonFn.unmask();
      }
    },

    /**
     * Xử lý trước khi save
     */
    async beforeSave(model){

    },

    /**
		 * Xử lý sau khi cất thành công
		 */
		async afterSaveSuccess() {
      
		},

    /**
		 * Khởi tạo observe control
		 * .ms-validate được thêm vào root khi khai báo rules
		 */
		addObserveControl() {
      const me: any = this;
			if (!me._observeControls) {
				me._observeControls = [];
				const $el = me.$el;
				let $controls = null;
				if($el && typeof $el.querySelectorAll == 'function'){
					$controls = $el.querySelectorAll('.ms-validate');
				}
				if ($controls && $controls.length > 0) {
					$controls.forEach((item) => {
						if (typeof item.getVueInstance === 'function') {
							me._observeControls.push(item.getVueInstance());
						}
					});
				}
			}
		},

    /**
		 * Hàm validate các control input
		 * Hàm này sử dụng component ms-validate
		 * để bao ngoài vùng được validate
		 * @Chú ý:ref của ms-validate phải là validateObserver
		 */
		async validateComponents() {
      const me: any = this;
      let controls = me._observeControls.filter((x) => x.$el.offsetWidth || x.$el.offsetHeight || x.$el.getClientRects().length);
			if (controls.length > 0) {
				const errors = controls.map((x) => {
					if (typeof x.validate === 'function') {
						return x.validate();
					}
					return '';
				});
				let indexFirst = errors.findIndex((item) => item);
				if (indexFirst !== -1) {
					showError(errors[indexFirst]).then(() => me.focusFirstError()); // show popup cảnh báo, không cần truyền title
				}
				return !errors.some((x) => x);
			}
			return true;
    },

    /**
		 * Hàm dùng để focus vào ô lỗi đầu tiên
		 * */
    focusFirstError() {
			const me: any = this;
			const $el = me.$el;
			let firstErrorEl = null;
			if($el && typeof $el.querySelector == 'function'){
				firstErrorEl = $el.querySelector('.ms-editor .input-error');
			}
			if (typeof firstErrorEl?.focus === 'function') {
				firstErrorEl.focus();
			}
		},

    /**
		 * Hàm validate custom trước khi save
		 */
		async validateSaveCustom() {
			return true;
		},

    /**
		 * Kiểm tra dữ liệu trước khi cất
		 */
		async validateSave() {
			const me: any = this;
			return (await me.validateComponents() && await me.validateSaveCustom());
		},

	},
};
