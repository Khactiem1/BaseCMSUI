import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/system/roleAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "role_id",
      code: 'role_code',
    }
  },
  api,
);

class moduleRole {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleRole();
const useStore = defineStore('moduleRole', store);

export default useStore;