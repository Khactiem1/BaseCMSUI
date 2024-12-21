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
        <router-link v-if="!item.child.length" :to="item.url" class="menu-sidebar_item">
          <!-- <div class="menu-sidebar_icon" :class="[`${item.icon}`]"></div> -->
          <i class="menu-sidebar_icon" :class="item.icon"></i>
          <div v-if="settingApp.showSidebar" class="menu-sidebar_text">{{ $t(`i18nMenu.sub_system_code.${item.menu_code}`) }}</div>
          <div v-if="!settingApp.showSidebar" class="menu-sidebar_item-info">
            {{ $t(`i18nMenu.sub_system_code.${item.menu_code}`) }}
          </div>
        </router-link>
        <a 
          v-else class="menu-sidebar_item" 
          :id="`${item.menu_code}-left-menu-id-parent`" 
          @mouseenter="activeChildMenu(`${item.menu_code}-left-menu-id`)"
          @mouseleave="(e) => { hideChildMenu(e, `${item.menu_code}-left-menu-id`) }"
        >
          <!-- <div class="menu-sidebar_icon" :class="[`${item.icon}`]"></div> -->
          <i class="menu-sidebar_icon" :class="item.icon"></i>
          <div v-if="settingApp.showSidebar" class="menu-sidebar_text">{{ $t(`i18nMenu.sub_system_code.${item.menu_code}`) }}</div>
          <teleport to="#app">
            <div 
              :id="`${item.menu_code}-left-menu-id`" 
              class="child-menu"
              :class="[`${ item.isShowOneLine ? 'is-show-one-line' : '' }`]"
              :style="{
                'width': `${item.width}px`
              }"
              @mouseleave="(e) => { hideChildMenu(e, `${item.menu_code}-left-menu-id`) }"
            >
              <div v-for="child in item.child" class="child-menu-item">
                <div class="menu-sidebar_item active group-title">
                  <div class="menu-sidebar_text">{{ $t(`i18nMenu.sub_system_code.${child.menu_code}`) }}</div>
                </div>
                <div class="contaner-child-menu-item">
                  <router-link 
                    v-for="childItem in child.child"
                    :to="childItem.url" class="child-menu-item menu-sidebar_item"
                  >
                    <div class="menu-sidebar_text">{{ $t(`i18nMenu.sub_system_code.${childItem.menu_code}`) }}</div>
                  </router-link>
                </div>
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
import menuAPI from "@/apis/system/menuAPI";
import authService from "@/commons/authService";

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
    onMounted(async () => {
      const me = proxy;
      await authService.getAllPermission();
      const allMenu = await loadAllMenu();
      allMenu.forEach((item) => {
        item.width = 600;
        item.isShowOneLine = false; // chỉ show lấy 1 dòng
        if ((!item.child.length && checkPermissionView(item.menu_code)) || (item.child.length && processChildMenuItem(item))){
          listMenuItem.push(item);
        }
      });
    });

    /**
     * Load toàn bộ menu về
     */
    const loadAllMenu = async () => {
      const me = proxy;
      let allMenu: any [] = [];
      const payload = {
        "PageIndex": 0,
        "PageSize": 0,
        "Columns": "*",
        "Filter": '[["is_active","=",true]]',
        "Sort": "",
        "CustomParam": {}
      };
      me.$ms.commonFn.mask();
      const result = await menuAPI.getList(payload);
      me.$ms.commonFn.unmask();
      if(result?.Success && result?.Data?.PageData?.length){
        allMenu = sortMenuByParentChild(result.Data.PageData);
      }
      return allMenu;
    };

    /**
     * sắp xếp cha con và sort
     */
    const sortMenuByParentChild = (menus: any []) => {
      const idMap = new Map();
      const roots: any [] = [];

      // Bước 1: Tạo Map để ánh xạ menu_id
      menus.forEach((menu: any) => {
        menu.child = []; // Khởi tạo danh sách con
        idMap.set(menu.menu_id, menu);
      });

      // Bước 2: Xây dựng cây cha-con
      menus.forEach((menu: any) => {
        if (menu.parent_id) {
          // Nếu có parent_id, thêm vào child của cha
          const parent = idMap.get(menu.parent_id);
          if (parent) {
            parent.child.push(menu);
          }
        } else {
          // Nếu không có parent_id, đó là nút gốc
          roots.push(menu);
        }
      });

      // Hàm sắp xếp các menu theo trường `sort`
      const sortMenus = (menuList: any []) => {
        menuList.sort((a, b) => a.sort - b.sort);
        menuList.forEach(menu => {
          if (menu.child && menu.child.length > 0) {
            sortMenus(menu.child); // Đệ quy sắp xếp danh sách con
          }
        });
      };
      // Bước 3: Sắp xếp danh sách gốc và con theo `sort`
      sortMenus(roots);
      return roots;
    };

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
        if ((distanceToTop + elm.getBoundingClientRect().height) > window.innerHeight){
          elm.style.top = `${window.innerHeight - elm.getBoundingClientRect().height - 8}px`;
        }
        else{
          elm.style.top = `${distanceToTop}px`;
        }
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
      if(menuItem.child?.length){
        menuItem.child.forEach((item: any) => {
          item.child = item.child.filter((_: any) => checkPermissionView(_.menu_code));
        });
        menuItem.child = menuItem.child.filter((_: any) => _.child.length);
        if(menuItem.child.length){
          return true;
        }
      }
      return false;
    }

    /**
     * Check quyền view màn hình theo sub_system_code
     */
    const checkPermissionView = (sub_system_code: string) => {
      if (!sub_system_code) return true;
      return authService.checkActionPermissonNotAsync("View", sub_system_code);
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
  margin-left: 12px;
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
  padding: 18px 8px 6px 8px;
  background-color: var(--menu__color);
  flex-wrap: wrap;
  border-radius: 2px;
  .child-menu-item{
    width: 50%;
    padding: 0 8px;
    margin-bottom: 16px;
    .menu-sidebar_item{
      padding: 0 6px;
      height: 26px;
    }
    .group-title{
      background-color: #2b2b2b;
      font-family: "notosans-semibold";
      font-weight: 700;
      cursor: unset;
      &::before{
        background-color: unset;
      }
    }
  }
  .contaner-child-menu-item{
    margin-top: 10px;
    .child-menu-item{
      width: 100%;
      height: 32px;
      margin-bottom: 0;
    }
  }
}
.is-show-one-line{
  .child-menu-item{
    width: 100% !important;
  }
}
</style>
