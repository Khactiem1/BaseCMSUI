<template>
  <div class="wrapper">
    <router-view></router-view>
    <modals-container></modals-container>
    <dialog-wrapper />
    <the-top-message-list></the-top-message-list>
  </div>
  <div id="mloading" class="loading">
    <div class="loading-cover loading-cover-amis"></div>
    <div class="loading-svg loading-amis">
      <div class="effects"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DialogWrapper } from 'vue3-promise-dialog';
import TheTopMessageList from '@/components/toast/TheTopMessageList.vue'

</script>

<style lang="scss" scoped>

</style>
