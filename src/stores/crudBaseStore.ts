import { concat } from "lodash-es";
import commonFunction from "@/commons/commonFunction";
import { EnumValidateResult } from "@/commons/wildcards/constants/EnumValidateResult";

/**
 * Base Store Crud pinia
 */
export default class crudBaseStore{
  constructor(config: any, api: any){
    this.state = {
      /**
       * Số lượng bản ghi
       */
      total: 0,

      /**
       * Bản ghi đang paging
       */
      items: [],
      
      /**
       * loading
       */
      loading: false,

      /**
       * Cấu hình của store
       */
      _config: config,
    }
    this.actions = {
      /**
       * Cập nhật trạng thái đang loading
       * @param data 
       */
      updateLoading(data: any) {
        const me: any = this;
        me.loading = data;
      },

      /**
       * Load danh sách
       */
      async load(payload: any) {
        const me: any = this;
        let res: any = {};
        try {
          me.updateLoading(true);
          res = await api.getList(payload || {});
          if(res && res.Data){
            me.items = res.Data.PageData;
            me.total = res.Data.Count;
          }
        } finally {
          me.updateLoading(false);
        }
        return res.Data;
      },

      /**
       * Thêm mới
       */
      async insert(payload: any) {
        const me: any = this;
        let res = await api.insert(payload);
        if (res && res.Success) {
          //cập nhật danh sách
          me.insertItem(res.Data);
        }
        else{
          if(res.Data.length){
            let duplicateDel = res.Data.filter((_: any) => _.Code == EnumValidateResult.DuplicateDelete);
            if(duplicateDel?.length){
              return duplicateDel[0];
            }
            else{
              commonFunction.handleErrorValidateResult(res.Data);
            }
          }
        }
        return res;
      },

      /**
       * Cập nhật
       */
      async update(payload: any) {
        const me: any = this;
        let res = await api.update(payload, payload[config.field.key]);
        if (res && res.Success) {
          //cập nhật danh sách
          me.updateItem(res.Data);
        }
        else{
          commonFunction.handleErrorValidateResult(res.Data);
        }
        return res;
      },

      /**
       * Cập nhật khi thêm bản ghi
       */
      insertItem(data: any) {
        const me: any = this;
        let newItem = data;
        me.items = concat(newItem, me.items);
        me.total += 1;
        me.empty = false;
      },

      /**
       * Cập nhật item
       * @param {} data
       */
      updateItem(data: any) {
        const me: any = this;
        let keyField = me._config.field.key;

        if (keyField) {
          let id = data[keyField];
          for (let i = 0; i < me.items.length; i++) {
            let item = me.items[i];
            if (item[keyField] === id) {
              Object.assign(item, data);
              break;
            }
          }
        }
      },

      /**
       * Xóa
       */
      async delete(payload: any) {
        const me: any = this;
        let keyField = me._config.field.key;
        if(keyField){
          payload = { id: payload[keyField] };
          let res = await api.delete(payload);
          if (res && res.Success) {
            //cập nhật danh sách
            let index = me.items.findIndex((_: any) => _[keyField] == payload.id);
            if (index !== -1){
              me.items.splice(index, 1);
              me.total -= 1;
            }
          }
          return res;
        }
      },
    }
  }
  /**
   * Các state của store
   */
  state = {
    
  }

  /**
   * action của store
   */
  actions = {
    
  }
}