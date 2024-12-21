<template>
	<div class="background">
		<div class="container-login">
			<form @submit.prevent="handleLogin()" class="form form_user_in">
				<div class="form-header-login">
					<div class="title-login">
						<h2>{{ $t('i18nCommon.Login') }}</h2>
					</div>
				</div>
				<div class="form-container-login">
					<div class="form-item_input">
						<div class="form-group">
							<ms-input
								:label="$t('i18nUser.Detail.user_name')" 
								v-model="user.user_name"
							></ms-input>
						</div>
					</div>
					<div class="form-item_input">
						<div class="form-group pass">
							<ms-input
								:type="typePass"
								:label="$t('i18nUser.Detail.password')"
								v-model="user.password"
							></ms-input>
							<i class="eye" :class="typePass" @click="() => {
								if(typePass === 'password'){
									typePass = 'text';
								}
								else{
									typePass = 'password';
								}
							}"></i>
						</div>
					</div>
				</div>
				<div class="form-action">
					<div class="form-action_container-login">
						<div style="width: 100%;" class="form-action_item">
							<ms-button style="width: 100%;" type="submit" class="btn primary">
								{{ $t('i18nCommon.Login') }}
							</ms-button>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>
  
<script lang="ts">
import userAPI from '@/apis/system/userAPI';
import { defineComponent, getCurrentInstance, reactive, ref } from 'vue';

export default defineComponent({
  components: {

  },
  setup: () => {
    const { proxy } : any = getCurrentInstance(); // Instance của component
    const user = reactive({
      user_name: '',
      password: ''
    });
    const typePass = ref('password');

    /**
     * Hàm xử lý login
     */
    const handleLogin = async () => {
      const me: any = proxy;
      me.$ms.commonFn.mask();
      const result = await userAPI.login(user);
      me.$ms.commonFn.unmask();
      if(result?.Data?.access_token){
        me.$ms.commonFn.setUser(result.Data);
        window.location.reload();
      }
      else{
        me.$ms.commonFn.pushNotification({
          type: me.$ms.constant.ENotificationType.Error,
          message: me.$t('i18nCommon.is_valid_user'),
        });
      }
    };

    return {
      user,
      typePass,
      handleLogin,
    }
  },
});

</script>

<style scoped>
.background{
	height: 100vh;
	width: 100%;
	background: url('../assets/image/bg2.jpg') center no-repeat;
}
.container-login{
	position: relative;
}
.title-login h2 {
  padding: 0 0 4px 0;
  font-size: 20px;
}
.form_user_in{
  width: 350px;
  height: 250px;
  position: absolute;
  top: calc(100% + 200px);
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--while__color);
  border-radius: 4px;
  padding: 10px 32px 30px 32px;
}
.pass{
	position: relative;
}
.eye{
	display: block;
	width: 16px;
	height: 16px;
	position: absolute;
	top: 55%;
	cursor: pointer;
	transform: translateY(-50%);
	right: 8px;
}
.eye.password{
	background: url('../assets/image/icon-hide-pass.svg') center no-repeat;
}
.eye.text{
	background: url('../assets/image/icon-show-pass.svg') center no-repeat;
}
</style>