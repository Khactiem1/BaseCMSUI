<template>
  <div
    :class="{ active : animation }"
    class="alert"
    role="alert"
  >
    <div class="top-message_icon-content" :class="typeClass">
      <div class="top-message_icon" :class="lang" :content="typeClass=='alert-success' ? $t('i18nCommon.success')+'!' : typeClass == 'alert-error'? $t('i18nCommon.error')+'!' : $t('i18nCommon.wanning')+'!'"></div>
      <div class="top-message_content">
        {{ notificationScreen }}
      </div>
    </div>
    <div @click="handleCloseNotification" class="top-message_close">
      <div>&times;</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, onBeforeMount, onBeforeUnmount, ref, toRefs, defineComponent, getCurrentInstance } from 'vue';
import i18n from '@/i18n/i18n';

export default defineComponent({
  props: {
    notification: {},
    handleRemoveItem: {
      type: Function,
      default: () => {}
    }
  },
  setup(props){
    const { proxy }: any = getCurrentInstance();

    /** Lấy ra ngôn ngữ đang sử dụng */
    const lang = computed(() => i18n.global.locale.value);

    /**
     * Thông báo truyền từ props
     * Khắc Tiềm - 15.09.2022
     */
    const { notification }: any = toRefs(props);

    /**
     * Set timeout tự động tắt thông báo
     * Khắc Tiềm - 15.09.2022
     */
    const timeout: any = ref (null);

    /**
     * set hiệu ứng animation
     * Khắc Tiềm - 15.09.2022
     */
    const animation: any = ref(false);

    /**
     * set class loại thông báo
     * Khắc Tiềm - 15.09.2022
     */
    const typeClass: any = computed(()=>{
      return `alert-${notification.value.type}`;
    });

    /**
     * Thông báo binding lên
     * Khắc Tiềm - 15.09.2022
     */
    const notificationScreen = computed(()=>{
      if(Array.isArray(notification.value.message)){
        if(notification.value.message.length === 1){
          return notification.value.message[0];
        }
        else{
          let displayMessage = '';
          displayMessage = notification.value.message.reduce((acc: any, cur: any) => {
            // Nối lại thành chuỗi HTML
            return (acc += cur ? "- " + cur + "<br>" : "");
          }, "");
          return displayMessage;
        }
      }
      else{
        return notification.value.message;
      }
    });

    /**
     * khi mounted thì sẽ kích hoạt hiệu ứng
     * Khắc Tiềm - 15.09.2022
     */
    onMounted(()=>{
      setTimeout(()=>{        
        animation.value = true;
      },50)
    })

    /**
     * trước khi mounted thì sẽ set thời gian tự tắt thông báo
     * Khắc Tiềm - 15.09.2022
     */
    onBeforeMount(()=> {
      const me: any = proxy;
      timeout.value = setTimeout(() => {
        me.handleRemoveItem(notification.value);
      }, 3000);
    });

    /**
     * Hàm xử lý tắt thông báo
     * Khắc Tiềm - 15.09.2022
     */
    function handleCloseNotification(){
      const me: any = proxy;
      me.handleRemoveItem(notification.value);
    }

    /**
     * khi tắt thông báo thì sẽ remove hết setTimeOut
     * Khắc Tiềm - 15.09.2022
     */
    onBeforeUnmount(()=> {
      clearTimeout(timeout.value);
    });

    return {
      timeout,
      typeClass,
      animation,
      notificationScreen,
      lang,
      handleCloseNotification,
    }
  },
});
</script>
<style scoped>
.alert{
  width: 100%;
  border-radius: 4px;
  margin-top: 6px;
  min-height: 56px;
  background-color: var(--while__color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px 19px 20px;
  box-shadow: rgb(0 0 0 / 35%) 0px 5px 15px;
  transition: all ease 0.2s;
  transform: translateX(calc(100% + 10px));
}
.alert.active{
  transform: translateX(0);
}
.top-message_close div{
  width: 16px;
  height: 16px;
  cursor: pointer;
  font-size: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(153, 153, 153);
}
.top-message_close div:hover{
  color: rgb(80, 80, 80);
}
.top-message_icon{
  background: var(--url__icon) no-repeat;
  width: 20px;
	height: 20px;
  min-width: 20px;
	min-height: 20px;
  position: relative;
}
.top-message_icon-content{
  display: flex;
  align-items: center;
}
.alert-success .top-message_icon{
  background-position: -482px -146px;
  margin-right: 92px;
}
.alert-success .top-message_icon::before{
  content: attr(content);
  position: absolute;
  color: var(--primary__color);
  white-space: nowrap;
  font-family: "notosans-semibold";
  top: 50%;
  transform: translateY(-50%);
  left: 115%;
}
.alert-error .top-message_icon{
  background-position: -538px -146px;
  margin-right: 33px;
}
.alert-error .top-message_icon::before{
  content: attr(content);
  position: absolute;
  color: #DE3618;
  white-space: nowrap;
  font-family: "notosans-semibold";
  top: 50%;
  transform: translateY(-50%);
  left: 115%;
}
.alert-wanning .top-message_icon{
  background-position: -593px -145px;
  margin-right: 77px;
}
.alert-wanning .top-message_icon::before{
  content: attr(content);
  position: absolute;
  color: #F49342;
  white-space: nowrap;
  font-family: "notosans-semibold";
  top: 50%;
  transform: translateY(-50%);
  left: 115%;
}
.top-message_icon.en {
  margin-right: 70px;
}
</style>
