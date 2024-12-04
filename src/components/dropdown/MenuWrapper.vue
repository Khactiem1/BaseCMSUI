<template>
	<div class="menu-wrapper" ref="menu">
		<div @click.self="triggerClick" class="menu-button-container" ref="buttonContainer">
			<slot ref="buttonToggle" name="menu-button" v-if="$slots['menu-button']" :toggleMenu="(e) => toggleMenu(e)"></slot>
			<button v-else class="menu-wrapper-button" ref="button" :aria-expanded="isOpen.toString()" aria-haspopup="true" :aria-controls="id" @click="toggleMenu">
				<slot name="menu-button-text"></slot>
			</button>
		</div>
		<teleport to="body">
			<ul
				class="menu-wrapper-menu"
				:class="classRoot"
				v-if="isOpen"
				ref="list"
				role="menu"
				:id="id"
				@close_menu="closeHandler()"
				:style="{
					left: left,
					right: right,
					top: top,
					bottom: bottom,
					maxHeight: maxHeight + 'px',
					overflow: 'auto',
					minWidth: '120px'
				}"
			>
				<slot name="menu-content" :closeHandler="closeHandler"></slot>
			</ul>
		</teleport>
	</div>
</template>

<script lang="ts">
import { getCurrentInstance, ref } from 'vue';
import componentUtil from '@/commons/componentUtil';
import { onClickOutside } from '@vueuse/core';

export default {
	setup(props) {
		const { proxy }: any = getCurrentInstance();
		const buttonContainer = ref(null);
		const buttonToggle = ref(null);
		const list = ref(null);
		/**
		 * Click outside ẩn menu
		 */
		onClickOutside(
			list,
			(event: any) => {
				if(props.usingClickoutSide){
					proxy.isOpen = false;
				}
			},
			{
				ignore: [buttonContainer, buttonToggle],
			}
		);

		return { buttonContainer, buttonToggle, list, proxy };
	},
	props: {
		disabled: {
			default: false,
			type: Boolean,
		},
		hideInContent: {
			default: true,
			type: Boolean,
		},
		maxHeight: {
			default: null,
			type: Number,
		},
		classRoot: {
			default: '',
			type: String,
		},
		position: {
			default: null,
			type: Object,
		},
		allowHide:{ //tvtai bổ sung: nếu là true thì cho phép ẩn khi click vào các chỗ để ẩn
			default: true,
			type: Boolean
		},
		/**
		 * Có sử dụng clickout side hay không
		 * @author  hvanh - 22.6.2023 : fixbug 15413
		 */
		usingClickoutSide: {
			default: false,
			type: Boolean
		},

		topDistance: {
			type: [Number, String],
			default: 2
		}
	},

	data: function () {
		return {
			isOpen: false,
			id: null,
			left: 'unset',
			right: 'unset',
			top: 0,
			bottom: 'unset',
		};
	},
	mounted() {
		this.id = Math.random().toString(36).substring(2, 15);
	},
	unmounted() {
		document.removeEventListener('keydown', this.documentKeydown);
		document.removeEventListener('click', this.documentClick);
	},
	beforeUnmount() {
		let el = this.$refs.list;
		if (el) {
			el.remove();
		}
	},
	watch: {
		isOpen(newVal, oldVal) {
			if (newVal) {
				//Thực hiện gán sự kiện click outside
				//document.querySelector('body').click();
				setTimeout(() => {
					document.addEventListener('keydown', this.documentKeydown);
					document.addEventListener('click', this.documentClick);
				}, 0);

				this.top = '0px';
				this.left = '0px';

				this.$nextTick(() => {
					let position = componentUtil.getPosition(this.$refs['buttonContainer'], this.$refs['list'], this.position);

					//Cách thêm 2px so với target click
					this.top = position.top + this.topDistance + 'px';
					this.left = position.left + 'px';
				});
			} else {
				this.$emit('closeMenuWrapper');
				document.removeEventListener('keydown', this.documentKeydown);
				document.removeEventListener('click', this.documentClick);
			}
		},
	},
	methods: {
		documentKeydown(e) {
			if (e.key === 'Escape' && this.isOpen) {
				this.closeHandler();
			}
		},
		isDispose(target) {
			let el = this.$refs.list;
			//Các container sẽ ko dispose cell
			const classes = ['.calendar-container.datepicker', 'tr.combobox-item', 'combobox-item--text'];
			const dispose =
				classes.findIndex((className) => {
					if (target.closest && (target.closest(className) || target.className.contains(className))) {
						return true;
					}
					return false;
				}) === -1;

			if (dispose) {
				if (el !== target && !el.contains(target)) {
					return true;
				}
			}
		},
		documentClick(e) {
			let el = this.$refs.list;
			let target = e.target;

			if (this.hideInContent) {
				this.closeHandler();
				return;
			}

			if (this.isDispose(target)) {
				this.closeHandler();
			}
		},
		toggleMenu(e) {
			// e.stopPropagation();

			if (!this.disabled && this.allowHide) {
				this.$emit('click', !this.isOpen);
				this.isOpen = !this.isOpen;

				//Add class đánh dấu active
				if (this.isOpen) {
					this.$el.classList.add('active');
				} else {
					this.$el.classList.remove('active');
				}
			}
		},
		closeHandler() {
			this.$emit('beforeClose'); //Xử lý khi click vào các chỗ để ẩn
			if(this.allowHide){
				this.isOpen = false;

				//remove
				this.$el.classList.remove('active');
			}
		},
		/**
		 * Hàm thực thi click khi chỉ có 1 button trong buttonContainer
		 */
		triggerClick() {
			let buttons = this.$refs.buttonContainer.querySelectorAll('button');
			if (buttons.length == 1) {
				buttons[0].click();
			}
		},
	},
};
</script>

<style lang="scss">
.menu-wrapper-button {
	background-color: transparent;
	border: 1px solid #555;
	cursor: pointer;
	font-size: inherit;
	display: inline-block;
	border-radius: 3px;
	font-weight: 700;
	line-height: 20px;
	padding: 0 5px;
	text-align: center;
	white-space: nowrap;
	margin: 0 0 0 4px;
}

.menu-wrapper-button:focus {
	outline: 0;
	color: #236ca4;
	border-color: #236ca4;
	box-shadow: 0 0 3px 2px #236ca4;
}

.menu-wrapper-menu {
	list-style: none;
	padding: 1px;
	animation: slide-down 0.2s ease;
	position: absolute;
	z-index: 9999;
	background-color: white;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
	border: 1px solid #D5DFE2;
	border-radius: 2px;
	margin: 0;
}

.menu-wrapper-item {
	outline: none;
	padding: 6px 10px;
	color: inherit;
	text-decoration: none;
	height: 30px;
	cursor: pointer;
	display: block;
	transition: all 0.7s ease;
}

.menu-wrapper-item:hover {
	outline: 0;
	background-color: --while__color;
	border-radius: 2px;
	color: --primary__color;
	transition: all 0.2s ease;
	.menu-item-ic {
		&.ic-filter- {
			&contain:before {
				background-position: -432px -240px;
			}
			&equal:before {
				background-position: -359px -288px;
			}
			&not-equal:before {
				background-position: -335px -288px;
			}
			&not-contain:before {
				background-position: -311px -336px;
			}
			&greater-than:before {
				background-position: -263px -288px;
			}
			&greater-than-or-eq:before {
				background-position: -312px -288px;
			}
			&less-than:before {
				background-position: -240px -288px;
			}
			&less-than-or-eq:before {
				background-position: -289px -288px;
			}
			&start-with:before {
				background-position: -431px -288px;
			}
			&ends-with:before {
				background-position: -457px -288px;
			}
			&null:before {
				background-position: -384px -288px;
			}
			&not-null:before {
				background-position: -408px -288px;
			}
			&remove:before {
				background-position: -192px -288px;
			}
		}
	}
}

@keyframes slide-down {
	0% {
		opacity: 0;
		transform: translateY(-10px);
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}
.menu-wrapper{
	.toggle-button{
		.btn.third{
			width: 59px;
			min-width: 59px;
			.text {
				padding-right: 6px !important;
				padding-left: 10px;
			}
			border: 1px solid #D5DFE2;
		}
	}
}
</style>
