import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/system/userAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "user_id",
      code: 'user_name',
    }
  },
  api,
);

class moduleUser {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleUser();
const useStore = defineStore('moduleUser', store);

export default useStore;