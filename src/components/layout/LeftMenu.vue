<template>
  <div class="sidebar" :class="{ small : !settingApp.showSidebar}">
    <div class="logo-sidebar">
      <a v-if="settingApp.showSidebar" href="/" class="logo-sidebar_home"></a>
      <a v-if="settingApp.showSidebar" href="/" class="logo-sidebar_menu">
        <img
          src="../../assets/image/logo_event_trungthu.090d014b.svg" alt=""
        />
      </a>
      <div v-if="!settingApp.showSidebar" @click="handleClickToggleLeftMenu" class="logo-sidebar_active"></div>
    </div>
    <div class="menu-sidebar">
      <div v-for="item in listMenuItem" class="menu-items">
        <router-link v-if="item.path && !item.child" :to="item.path" class="menu-sidebar_item">
          <div class="menu-sidebar_icon" :class="[`${item.icon}`]"></div>
          <div v-if="settingApp.showSidebar" class="menu-sidebar_text">{{ item.text }}</div>
          <div v-if="!settingApp.showSidebar" class="menu-sidebar_item-info">
            {{ item.text }}
          </div>
        </router-link>
        <a 
          v-else class="menu-sidebar_item" 
          :id="`${item.group}-parent`" 
          @mouseenter="activeChildMenu(item.group)"
          @mouseleave="(e) => { hideChildMenu(e, item.group) }"
        >
          <div class="menu-sidebar_icon" :class="[`${item.icon}`]"></div>
          <div v-if="settingApp.showSidebar" class="menu-sidebar_text">{{ item.text }}</div>
          <teleport to="#app">
            <div :id="item.group" class="child-menu" @mouseleave="(e) => { hideChildMenu(e, item.group) }">
              <div v-for="child in item.child" class="child-menu-item">
                <router-link :to="child.path" class="menu-sidebar_item">
                  <div class="menu-sidebar_text">{{ child.text }}</div>
                </router-link>
              </div>
            </div>
          </teleport>
        </a>
      </div>
    </div>
    <the-change-language :settingApp="settingApp"></the-change-language>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, getCurrentInstance, onMounted } from "vue";
import TheChangeLanguage from '@/components/layout/TheChangeLanguage.vue';

export default defineComponent({
  components: {
    TheChangeLanguage,
  },
  props: {
    settingApp: {
      type: Object,
      default: {},
    },
  },
  setup(){
    const { proxy } : any = getCurrentInstance();
    const listMenuItem : any [] = reactive([]); // Danh sách menu có thể nhìn thấy theo quyền hạn

    /**
     * Khởi tạo các màn hình có thể view
     */
    onMounted(() => {
      const me = proxy;
      const allMenu : any [] = [
        {
          path: "/dashboard",
          icon: "dashboard",
          text: me.$t("i18nCommon.Dashboard"),
          subSystemCode: ""
        },
        {
          path: "/demoControl",
          icon: "dashboard",
          text: 'demoControl',
          subSystemCode: ""
        },
        {
          group: "dictionary-group-id",
          icon: "dictionary",
          text: me.$t("i18nCommon.Dictionary"),
          child: [
            {
              path: "/ditionary/employee",
              text: me.$t("i18nEmployee.Title"),
              subSystemCode: ""
            },
          ]
        },
      ];
      allMenu.forEach((item) => {
        if ((!item.child && checkPermissionView(item.subSystemCode)) || (!item.path && processChildMenuItem(item))){
          listMenuItem.push(item);
        }
      });
    });

    /**
     * Sự kiện hover vào parent Menu active child menu
     */
    const activeChildMenu = (idElm: string) => {
      const me = proxy;
      const elm = document.getElementById(idElm);
      const elmParent = document.getElementById(`${idElm}-parent`);
      if(elm && elmParent){
        elm.style.display = "flex";
        if(me.settingApp.showSidebar){
          elm.style.left = "202px";
        }
        else{
          elm.style.left = "54px";
        }
        const distanceToTop = elmParent.getBoundingClientRect().top + window.scrollY;
        elm.style.top = `${distanceToTop}px`;
      }
    }

    /**
     * Ẩn menu child đi
     */
    const hideChildMenu = (e: any,idElm: string) => {
      const elm = document.getElementById(idElm);
      const toClassNameElm = e?.toElement?.className;
      if(!(toClassNameElm && toClassNameElm.includes('child-menu')) && elm){
        elm.style.display = "none";
      }
    }

    /**
     * Check quyền màn hình Child
     */
    const processChildMenuItem = (menuItem: any) => {
      const me = proxy;
      if(menuItem.child?.length){
        menuItem.child = menuItem.child.filter((_: any) => checkPermissionView(_.subSystemCode));
        if(menuItem.child.length){
          return true;
        }
      }
      return false;
    }

    /**
     * Check quyền view màn hình theo subSystemCode
     */
    const checkPermissionView = (subSystemCode: string) => {
      const me = proxy;
      if (!subSystemCode) return true;

      return false;
    }

    /**
     * Xử lý toggle LeftMenu
     */
     const handleClickToggleLeftMenu = () => {
      const me = proxy;
      me.settingApp.showSidebar = !me.settingApp.showSidebar;
      localStorage.setItem("showSidebar", me.settingApp.showSidebar);
    }

    return {
      listMenuItem,
      handleClickToggleLeftMenu,
      activeChildMenu,
      hideChildMenu,
    }
  }
})
</script>

<style lang="scss" scoped>
/* chia sidebar 
----------------------------
*/
.sidebar {
  position: relative;
  width: 200px;
  min-width: 200px;
  background-color: var(--menu__color);
  height: 100vh;
  top: 0;
  left: 0;
  &.small{
    width: 52px;
    min-width: 52px !important;
  }
}

/* Phần logo sidebar */
.logo-sidebar {
  display: flex;
  align-items: center;
  padding: 10px 18px;
  height: var(--height__header);
  justify-content: center;
}
.logo-sidebar_home {
  width: 24px;
  height: 24px;
  margin-right: 12px;
  background: var(--url__icon) no-repeat -424px -86px;
}
.logo-sidebar_menu {
  margin-right: 6px;
}
.logo-sidebar_menu img {
  height: 32px;
  vertical-align: middle;
  max-width: 104px !important;
  transform: scale(1.15);
  max-height: 36px;
}
.logo-sidebar_active {
  background: var(--url__icon) no-repeat;
  background-position: -316px -37px;
  width: 16px;
  height: 14px;
  cursor: pointer;
}


/* Phần menu */
.menu-sidebar{
  padding-top: 14px;
}
.menu-sidebar_item {
  position: relative;
  display: flex;
  align-items: center;
  color: var(--while__color);
  height: 42px;
  padding: 0 12px;
  cursor: pointer;
}
.menu-sidebar_item:hover .menu-sidebar_item-info{
  opacity: 1;
  visibility: visible;
}
.menu-sidebar_item-info{
  position: absolute;
  opacity: 0;
  visibility: hidden;
  background-color: #585858;
  height: 40px;
  padding: 11px 16px;
  border-radius: 4px;
  white-space: nowrap;
  left: 60px;
  top: 2;
  z-index: 10;
}
.menu-sidebar_item-info::before{
  position: absolute;
  content: '';
  width:0px;
  height:0px;
  border-left:8px solid transparent;
  border-right:8px solid transparent;
  border-bottom:8px solid #585858; /* Tam giác phía dưới được đổ màu */
  transform: rotate(-90deg);
  top: 50%;
  margin-top: -4px;
  left: -8px;
}
.menu-sidebar_item.active {
  background-color: var(--menu__color-active);
}
.menu-sidebar_item:hover {
  background-color: var(--menu__color-active);
}
.menu-sidebar_item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 6px;
  height: 100%;
}
.menu-sidebar_item.active::before {
  background-color: var(--primary__color);
}
.menu-sidebar_text {
  line-height: 42px;
  margin-left: 8px;
}
.menu-sidebar_item.active .menu-sidebar_text {
  font-family: "notosans-bold";
}
.child-menu{
  &::before{
    content: '';
    position: absolute;
    left: -8px;
    top: 0;
    width: 10px;
    height: 100%;
  }
  display: none;
  position: fixed;
  left: 202px;
  z-index: 10;
  width: 600px;
  padding: 12px;
  background-color: var(--menu__color);
  flex-wrap: wrap;
  border-radius: 2px;
  .child-menu-item{
    width: 50%;
    padding: 0 4px;
    .menu-sidebar_item{
      padding: 0 6px;
      height: 30px;
    }
  }
}
</style>
