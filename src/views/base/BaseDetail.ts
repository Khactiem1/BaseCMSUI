import { mixinSuper } from '@/mixins/common/mixinSuper';
import { showError, showAlert } from '@/commons/globalMessage';

/**
 * Các thông tin chung của màn hình chi tiết
 */
export default {
	mixins: [mixinSuper],
	data() {
		return {
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
      console.log("DEV: Gọi vào base hàm beforeBindData");
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
     * Xử lý cất dữ liệu
     */
    async save(){
      const me: any = this;
      await me.beforeSave();
      if(await me.validateSave()){
        let saveSuccess = false;
        me.$ms.commonFn.mask();
        switch (me.editMode) {
          case me.$ms.constant.FormState.Add:
            const resultSave = await me.storeModule.insert(me.model);
            if (resultSave?.Success){
              me.$ms.commonFn.pushNotification({
                type: me.$ms.constant.ENotificationType.Success,
                message: me.$t('i18nCommon.crud.save_success'),
              });
              saveSuccess = true;
            }
            break;
          case me.$ms.constant.FormState.Edit:
            const resultEdit = await me.storeModule.update(me.model);
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
    async beforeSave(){

    },

    /**
		 * Xử lý sau khi cất thành công
		 */
		async afterSaveSuccess() {
      
		},

    /**
		 * Hàm validate các control input
		 * Hàm này sử dụng component ms-validate
		 * để bao ngoài vùng được validate
		 * @Chú ý:ref của ms-validate phải là validateObserver
		 */
		async validateComponents() {
      const me: any = this;
      return true;
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
