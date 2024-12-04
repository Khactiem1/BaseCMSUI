<template>
  <div :class="{ 'lang-hidden_active' : !settingApp.showSidebar }" class="lang-hidden"> {{ lang }} </div>
  <div :class="{ 'switch-lang_hidden': !settingApp.showSidebar }" class="switch-lang">
    <div :class="{ 'active' : lang === 'vi' }" class="switch-lang_item" @click="handleChangLang('vi')">{{ $t('i18nCommon.vi') }}</div>
    <div :class="{ 'active' : lang === 'en' }" class="switch-lang_item" @click="handleChangLang('en')">{{ $t('i18nCommon.en') }}</div>
  </div>
</template>

<script lang="ts">
import i18n from '@/i18n/i18n';
import { computed, ref, defineComponent, getCurrentInstance } from 'vue';

export default defineComponent({
  props: {
    settingApp: {
      type: Object,
      default: {},
    },
  },
  setup(){
    const { proxy } : any = getCurrentInstance();
    const lang = computed(() => i18n.global.locale.value); // Lấy ra ngôn ngữ đang sử dụng

    /** Hàm thay đổi ngôn ngữ */
    const handleChangLang = (lang: string) => {
      try{
        i18n.global.locale.value = lang;
        localStorage.setItem("Lang", lang);
        window.location.reload();
      }
      catch(e: any){
        console.log(e);
      }
    }

    return {
      handleChangLang,
      lang,
    }
  }
})
</script>

<style lang="scss" scoped>
.switch-lang{
  display: flex;
  color: var(--while__color);
  font-family: "notosans-bold";
  width: 100%;
  text-align: center;
  align-items: center;
  position: absolute;
  top: calc(100% - 36px);
  left: 0;
  z-index: 100;
  border-top: solid 2px var(--primary__color);
}
.lang-hidden{
  position: absolute;
  top: calc(100% - 36px);
  left: 0;
  width: 100%;
  height: 36px;
  background-color: var(--menu__color);
  border-top: solid 2px var(--primary__color);
  cursor: pointer;
  color: var(--while__color);
  font-family: "notosans-bold";
  text-align: center;
  padding: 7px 0;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease-in-out;
}
.lang-hidden:hover {
  background-color: var(--menu__color-active) !important;
}
.lang-hidden_active{
  opacity: 1;
  visibility: visible;
}
.switch-lang.switch-lang_hidden{
  width: 175px;
  left: 52px;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s ease-in-out;
}
.switch-lang.switch-lang_hidden:hover{
  visibility: visible;
  opacity: 1;
}
.switch-lang_item{
  cursor: pointer;
  height: 34px;
  padding: 7px 0;
  transition: all 0.3s ease-in-out;
  width: 50%;
  background-color: var(--menu__color);
}
.switch-lang_item:hover:not(.active){
  background-color: var(--menu__color-active) !important;
}
.switch-lang_item.active{
  background-color: var(--primary__color) !important;
}

.lang-hidden:hover ~ .switch-lang.switch-lang_hidden {
  visibility: visible;
  opacity: 1;
}
</style>