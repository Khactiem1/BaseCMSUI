<template>
	<div class="msg-box" :style="appearAtProcess ? 'background-color: transparent !important;':''" @keydown.stop.prevent.esc="escPress($event, $close)">
		<div id="msg-box-container-apu-id" class="msg-center msg-box-container" ref="msg" :style="[appearAtProcess ? 'box-shadow: 0 3px 20px rgba(0, 0, 0, 0.16)':'',`width: ${width}px`]">
			<div class="msg-title" :style="customStyleTitle" v-if="title" v-html="$ms.commonFn.processXssValueAllowTargetBlank(title)"></div>
			<div v-if="!hideClose" class="msg-close icon24 close" @click="$close(this, false)"></div>
			<div class="msg-message" :style="styleCustom.msg_message">
				<div class="icon-message" v-if="icon" :style="customStyleIcon">
					<div class="icon48" v-if="!customIcon" :class="icon"></div>
					<div v-else :class="[customIcon, icon]"></div>
				</div>
				<template v-if="Array.isArray(message)">
					<div class="msg-item" v-for="(item, i) in message" :key="i" v-html="$ms.commonFn.processXssValueAllowTargetBlank(item)"></div>
				</template>
				<div class="msg-item" v-else v-html="$ms.commonFn.processXssValueAllowTargetBlank(message)"></div>
			</div>
			<div v-if="hasLineHr" class="msg-message-line"></div>
			<!-- Confirm -->
			<div class="msg-buttons flex-between" v-if="type == $ms.constant.MsgBoxType.Confirm">
				<button @click="$close(this, null)" class="msg-btn btn secondary-outline">
					{{ $t('i18nControl.MessageBox.Cancel') }}
				</button>
				<div class="flex-msg">
					<button @click="$close(this, false)" class="msg-btn btn secondary-outline">
						{{ $t('i18nControl.MessageBox.No') }}
					</button>
					<button @click="closeCustom(this, true)" class="msg-btn btn primary">
						{{ $t('i18nControl.MessageBox.Yes') }}
					</button>
				</div>
			</div>
			<!-- Alert -->
			<div class="msg-buttons flex-between" v-if="type == $ms.constant.MsgBoxType.Alert">
				<button @click="$close(this, false)" class="msg-btn btn secondary-outline">
					{{ $t('i18nControl.MessageBox.Cancel') }}
				</button>
				<div>
					<button @click="$close(this, true)" class="msg-btn btn primary">
						{{ $t('i18nControl.MessageBox.Confirm') }}
					</button>
				</div>
			</div>
			<!-- Warning -->
			<div class="msg-buttons flex-center" v-if="type == $ms.constant.MsgBoxType.Warning">
				<button @click="$close(this, null)" class="msg-btn btn primary">
					{{ $t('i18nControl.MessageBox.Close') }}
				</button>
			</div>

			<!-- Error -->
			<div class="msg-buttons flex-center" v-if="type == $ms.constant.MsgBoxType.Error">
				<button @click="$close(this, null)" class="msg-btn btn primary">
					{{ $t('i18nControl.MessageBox.Close') }}
				</button>
			</div>

			<!-- Info -->
			<div class="msg-buttons flex-center" v-if="type == $ms.constant.MsgBoxType.Info">
				<button @click="$close(this, null)" class="msg-btn btn primary">
					{{ $t('i18nControl.MessageBox.Close') }}
				</button>
			</div>

			<!-- Custom -->
			<div class="msg-buttons" :class="classBtnCustom" v-if="type == $ms.constant.MsgBoxType.Custom">
				<button v-for="(btn, i) in btnListCustom" @click="() => {
						//nktiem: Nếu có callback thì tiến hành gọi callback, ko chủ động đóng, truyền vào callback 1 hàm đóng popup này để nếu callback có nhu cầu đóng popup thì sẽ gọi hàm là đóng
						if(typeof btn.callBackClick === 'function'){
							btn.callBackClick(
								() => {
									$close(this, null);
								}
							);
						}
						// th này là chủ động đóng và truyền dữ liệu lên để thực hiện 1 callback nào đó
						else{
							$close(this, { confirm: true, btn: btn});
						}
					}" :key="i" class="msg-btn btn" :class="btn.btnClass">
					{{ btn.text }}
				</button>
			</div>
			<button class="focus-loop" @focus="$ms.commonFn.focusFirstControl($refs['msg'])"></button>
		</div>
	</div>
</template>
<script>
import { getCurrentInstance, onMounted, ref, onUnmounted, watch, toRefs } from 'vue';
import commonFn from '@/commons/commonFunction';
import { closeDialog } from 'vue3-promise-dialog';

export default {
	props: {
		title: String,
		width: {
			type: Number,
			default: 480,
		},
		message: [String, Array],
		icon: String,
		type: {
			type: Number,
			default: 0,
		},
		hideClose: {
			type: Boolean,
			default: false,
		},
		textBtn: {
			type: String,
			default: null,
		},
		customLabelIsShowMessage: {
			type: String,
			default: null,
		},

		/**
		 * Object custom text của button VD: showConfirmValidate(message, title, width, customTextButton)
		 */
		customTextButton: {
			type: Object,
			default: { Yes: 'Có', No: 'Không' },
		},

		/**
		 * Có dòng kẻ ở giữa
		 * @author ldlong 14.06.2023
		 */
		hasLineHr: {
			type: Boolean,
			default: true,
		},

		/**
		 * Class custom button của msg box
		 * flex-center: Nút nằm ở giữa
		 * flex-between: 2 nút 2 bên
		 * flex-row: Dàn hàng ra để vẽ nhiều button
		 * @author ldlong 14.06.2023
		 */
		classBtnCustom:{
			type: String,
			default: null,
		},

		/**
		 * Danh sánh sách các button render khi dùng msg custom
		 * @author ldlong 14.06.2023
		 */
		btnListCustom:{
			type: Array,
			default: [],
		},

		/**
		 * Các tính năng custom thêm message popup
		 * @author ldlong 14.06.2023
		 */
		actionsCustom:{
			type: Array,
			default: [],
		},

		/**
		 * Custom style
		 * @author ldlong 27.07.2023
		 */
		styleCustom: {
			type: Object,
			default: {},
		},
		/**
		 * Có thể tùy chỉnh style cho icon
		 * @author hvanh 19.8.2023
		 */
		customStyleIcon : {
			type: Object,
			default: {},
		},
		customIcon: {
			type: String,
			default: null,
		},
		/**
		 * Có thể tùy chỉnh style title
		 */
		customStyleTitle : {
			type: Object,
			default: {},
		},
		closeEsc: {
			type: Boolean,
			default: true,
		},
		/**
		 * Cảnh báo hiện thị trên app Amis Quy trình
		 * @author ldlong 17.01.2023
		 */
		appearAtProcess: {
			type: Boolean,
			default: false,
		}
	},

	setup(props) {
		const { proxy } = getCurrentInstance();
		const { message } = toRefs(props);

		/** Nếu Height bị lẻ thì khi show lên thiết kế sẽ bị sai, xấu nên tính toán lại cho nó chẵn đẹp ko bị xấu */
		const calcHeight = () => {
			let element = document.getElementById('msg-box-container-apu-id');
			if(element){
				let currentHeight = element.clientHeight;
				// Kiểm tra xem chiều cao có là số lẻ không
				if (element.style && currentHeight % 2 !== 0) {
					// Nếu là số lẻ, cộng hoặc trừ đi 1px để làm cho nó chẵn
					element.style.minHeight = (currentHeight + 1) + 'px';
				}
			}
		};

		const closeCustom = (cur, val) => {
			let element = document.getElementById('msg-box-container-apu-id');
			if(element){
				element.style.minHeight = '';
			}
			proxy.$close(cur, val);
		};

		watch(message, (newVal) => {
			proxy.$nextTick(() => {
				calcHeight();
			});
		});

		const option = ref(1); // Option trả về
		onMounted(() => {
			//TVTHAI, setTimeOut 0ms rồi mới focus, sửa lỗi enter ở ô input mà show cảnh báo thì nó nó chạy luôn vào hàm click của msMessageBox vì nó đang được focus
			//focus button
			setTimeout(() => {
				commonFn.focusFirstControl(proxy.$refs['msg']);
			}, 0);
			setActionsEvent();
			calcHeight();
		});


		onUnmounted(() => {
			removeActionsEvent();
		});

		// v-model cho text area: Lý do
		const textAreaValue = ref('');

		function escPress(e, close) {
			e.preventDefault();
			if(proxy.closeEsc){
				close(this, null);
			}
		}

		function closeMessage(){
			closeDialog(proxy);
		}

		let setActionsEvent = ()=> {
			if (props.actionsCustom && props.actionsCustom.length > 0) {
				let actionLst = props.actionsCustom;
				actionLst.forEach(action => {
					let ele = proxy.$el.querySelector(action.elementSelector);
					if (ele) {
						ele.addEventListener(action.event || 'click', action.method);
						if(!action.keepAlive)
						{
							ele.addEventListener(action.event || 'click', closeMessage);
						}
					}
				});
			}
		}

		let removeActionsEvent = () => {
			if (props.actionsCustom && props.actionsCustom.length > 0) {
				let actionLst = props.actionsCustom;
				actionLst.forEach(action => {
					let ele = proxy.$el.querySelector(action.elementSelector);
					if (ele) {
						ele.removeEventListener(action.event || 'click', action.method);
						ele.removeEventListener(action.event || 'click', closeMessage);
					}
				});
			}
		}

		return {
			escPress,
			option,
			closeCustom,
			textAreaValue
		};
	},
};
</script>

<style lang="scss" scoped>
.msg-box {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background-color: #0000004d;
	z-index: 9999;
	.msg-center {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    box-shadow: 0 3px 20px #00000014;
    border-radius: 2px;
	}
	.msg-box-container {
    font-size: 14px;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
	}
	.msg-title {
    margin-bottom: 20px;
    font-weight: 700;
	}
	.msg-close {
    position: absolute !important;
    top: 16px;
    right: 20px;
	}
	.msg-message{
    display: flex;
    align-items: center;
    -moz-column-gap: 12px;
    column-gap: 12px;
    line-height: 20px;
    margin-bottom: 20px;
	}
	.icon-message {
    margin: 2px;
	}
  .msg-item {
    font-size: 14px;
    max-height: 400px;
    overflow-y: auto;
  }
	.msg-message-line {
    border-top: 1px solid #cad2d5;
    margin-bottom: 16px;
	}
	.msg-buttons {
    border-radius: 0 0 2px 2px;
	}
	.flex-msg{
		.msg-btn{
			&:first-child{
				margin-right: 8px;
			}
		}
	}
}
</style>
