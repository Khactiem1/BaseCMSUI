import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/system/menuAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "menu_id",
      code: 'menu_code',
    }
  },
  api,
);

class moduleMenu {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleMenu();
const useStore = defineStore('moduleMenu', store);

export default useStore;