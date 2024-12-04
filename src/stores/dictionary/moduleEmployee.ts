import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/dictionary/employeeAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "employee_id",
      code: 'employee_code',
    }
  },
  api,
);

class moduleEmployee {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleEmployee();
const useStore = defineStore('moduleEmployee', store);

export default useStore;