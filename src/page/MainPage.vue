<template>
  <left-menu :settingApp="settingApp"></left-menu>
  <div class="content">
    <the-navbar :settingApp="settingApp"></the-navbar>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import LeftMenu from '@/components/layout/LeftMenu.vue';
import TheNavbar from '@/components/layout/TheNavbar.vue';
import { reactive } from "vue";

const settingApp = reactive({
  showSidebar: localStorage.getItem("showSidebar") == 'false' ? false : true,
});

</script>

<style lang="scss" scoped>

</style>
