<template>
  <div class="notifications-list" id="notifications-list-id-app">
    <the-top-message
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
      :handleRemoveItem="handleRemoveItem"
    >
    </the-top-message>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import TheTopMessage from './TheTopMessage.vue'

export default defineComponent({
  components: {
    TheTopMessage,
  },
  setup(){
    const notifications: any [] = reactive([]);

    const handleRemoveItem = (item: any) => {
      let index = notifications.findIndex((_: any) => _.id == item.id);
      if (index!== -1){
        notifications.splice(index, 1);
      }
    };

    return{
      handleRemoveItem,
      notifications,
    }
  }
});
</script>

<style>
.notifications-list {
  position: fixed;
  top: 0;
  right: 0;
  min-width: 450px;
  max-width: 450px;
  z-index: 1000;
  margin-right: 10px;
  margin-top: 10px;
  transition: all ease 0.2s;
}
</style>
