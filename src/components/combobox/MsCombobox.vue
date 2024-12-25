<template>
  <div ref="template" class="data-input" :class="{ 'is-valid': isValid }">
    <label v-if="label" :class="{ required: required }">{{ label }}</label>
    <span v-if="toolTip" class="tool-tip">{{toolTip}}</span>
    <!-- Thêm 'active' là sẽ chạy -->
    <div
      class="combobox-select"
      :class="{ active: noAnimation ? isShow : isShowAnimation, 'add-icon' : addIcon }"
    >
      <div v-if="selectMultiple && modelValue.length > 0" class="select-multiple_list">
        <div class="selected-item" v-for="(item, index) in modelValue" :key="index">
          <div class="selected-text">
            {{ data.find((v) => v[value || ''] === item)[headerSelectMultiple] || '' }}
          </div>
          <div class="selected-icon" @click="preventClose($event); handleSaveData(item)"></div>
        </div>
      </div>
      <input
        ref="input"
        :placeholder="placeholder"
        @focus="handleFocusInput"
        class="input"
        :value="i18n ? inputEvent === 'common.paging' ? $t(inputEvent, { record:  modelValue}) :  $t(inputEvent) : inputEvent"
        @input="handleInput"
        @blur="handleBlur"
        type="text"
        :readonly="disabled || i18n"
        :tabindex="tab"
      />
      <div class="combobox-select_icon" @click="handleClickOpenCombobox">
        <div class="select_icon-combobox"></div>
      </div>
      <div class="icon-add" @click="handleAddIcon()" v-if="addIcon">
        <div class="select_icon-add"></div>
      </div>
      <div v-show="isShow" class="combobox-combobox_select" :style="{width : widthOptionSelect}">
        <div v-if="labelCode && labelName" class="combobox-labelName">
          <div v-if="labelCode" class="label-item label-code" :style="{width: widthLabelCode}">
            {{ labelCode }}
          </div>
          <div class="label-item label-name">
            {{ labelName }}
          </div>
        </div>
        <div v-if="optionValue.length === 0" class="combobox-combobox_item">
          {{ $t('i18nCommon.data_empty') }}
        </div>
        <div ref="listSelect" class="combobox-combobox_select-content" :class="{'select-multiple' : selectMultiple}">
          <div
            class="combobox-combobox_item"
            v-for="(item, index) in optionValue"
            :key="index"
            @click="handleClickItem(item[value || ''])"
            :class="{
              active: (valueClick === item[value || ''] && !selectMultiple) || (selectMultiple && modelValue.includes(item[value || ''])),
              hover: valueClick == item[value || ''] && selectMultiple,
            }"
          >
            <div v-if="labelCode" class="label-item label-code" :style="{width: widthLabelCode}">
              <span v-html="item.bindHTMLChild"></span>
              {{ item[headerCode || ''] }}
            </div>
            <div class="label-item label-name">
              {{ i18n ? item[header] === 'common.paging' ? $t(item[header], { record:  item[value || '']}) : $t(item[header]) : item[header]}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <span class="message-valid" :style="{left : leftMessage}">{{ messageValid }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, onMounted, onUnmounted, onBeforeMount, watch, getCurrentInstance } from "vue";
import { debounce } from 'lodash-es'

export default defineComponent({
  props: {
    /**
     * Combobox enum
     */
    enum: {
      type: String,
      default: ''
    },
    /**
     * Độ dài của option select
     */
    widthOptionSelect: {
      type: String,
      default: ''
    },
    /**
     * giá trị v-model
     */
    modelValue: {
      default: (): any => ''
    },
    /**
     * Giá trị được chọn trong form select
     */
    value: {
      type: String,
    },
    /**
     * Giá trị hiển thị lên combobox
     */
    header: {
      type: String,
      default: ''
    },
    /**
     * Giá trị hiển thị lên form select phần code
     */
    headerCode: {
      type: String,
    },
    /**
     * Value mặc định
     */
    defaultValue: {},
    /**
     * label hiển thị của input
     */
    label: {
      type: String,
    },
    /**
     * Label code hiển thị thêm bổ sung
     */
    labelCode: {
      type: String,
    },
    /**
     * Độ dài của trường hiển thị code
     */
    widthLabelCode: {
      type: String,
      default: ''
    },
    /**
     * Giá trị hiển thị phần tên
     */
    labelName: {},
    /**
     * dữ liệu select và hiển thị
     */
    data: {
      type: Array,
      default: (): any [] => []
    },
    /**
     * placeholder ô input
     */
    placeholder:{
      default: ''
    },
    /**
     * có bắt buộc hay không
     */
    required: {},
    /**
     * tabindex
     */
    tab: {
      default: 0,
    },
    /**
     * báo lỗi khi giá trị sai
     */
    messageValid: {},
    /**
     * Hiệu ứng
     */
    noAnimation: {},
    /**
     * Không cho nhập
     */
    disabled: {
      default: false
    },
    /**
     * Tooltip hiển thị bổ sung
     */
    toolTip:{},
    /**
     * Icon add phục vụ thêm ngay tại form
     */
    addIcon: {},
    /**
     * Hiển thị thông báo bên left
     */
    leftMessage:{
      type: String,
      default: ''
    },
    /**
     * xử lý khi bấm nút addIcon
     */
    handleAddIcon:{
      type: Function,
      default: ()=> {}
    },
    /**
     * Có là combobox select nhiều hay không
     */
    selectMultiple:{},
    /**
     * Giá trị hiển thị khi select nhiều 
     */
    headerSelectMultiple:{
      default: ():any => ''
    },
    /**
     * Có auto set vị trí hay không
     */
    autoPosition: {},

    i18n: {
      default: false
    }
  },
  setup(props, context) {
    const { proxy }: any = getCurrentInstance();
    /**
     * data: Dữ liệu lặp để hiển thị
     * header: trường hiển thị
     * modelValue: giá trị được chọn
     * value: giá trị binding cùng dữ liệu hiển thị
     * defaultValue: giá trị mặc định
     * noAnimation: có hiệu ứng hay không
     * required: có bắt buộc hay không
     * Khắc Tiềm - 15.09.2022
     */
    const { data, header, modelValue, defaultValue, value, noAnimation, required, headerCode, selectMultiple, autoPosition }: any = toRefs(props);

    /**
     * Giá trị mảng binding lên giao diện
     * Khắc Tiềm - 15.09.2022
     */
    const optionValue: any = ref(null);

    /**
     * Element chứa danh sách select
     * Khắc Tiềm - 15.09.2022
     */
    const listSelect: any = ref(null);

    /**
     * Trạng thái hiển thị validate
     * Khắc Tiềm - 15.09.2022
     */
    const isValid: any = ref(false);

    /**
     * biến thực hiện ẩn mở dropdown
     * Khắc Tiềm - 15.09.2022
     */
    const isShow: any = ref(false);

    /**
     * biến bắt lưu trạng thái animation
     * Khắc Tiềm - 15.09.2022
     */
    const isShowAnimation: any = ref(false);

    /**
     * biến bắt lấy thẻ to nhất của component
     * Khắc Tiềm - 15.09.2022
     */
    const template: any = ref(null); //(Khắc Tiềm - 15.09.2022)   

    /**
     * biến bắt lấy thẻ input
     * Khắc Tiềm - 15.09.2022
     */
    const input: any = ref(null);

    /**
     * biến lưu dữ liệu value khi được click
     * Khắc Tiềm - 15.09.2022
     */
    const valueClick: any = ref(undefined);

    /**
     * Set vị trí list select hiển thị
     * Khắc Tiềm - 15.09.2022
     */
    const positionListSelect: any = ref({ top: "calc(100% + 3px)", });

    const KeyCode = {
      Esc: 27,
      Ctrl: 17,
      Alt: 18,
      A: 65,
      Shift: 16,
      S: 83,
      Up: 38,
      Down: 40,
      Back: 8,
      Enter: 13,
      Tab: 9,
      F1: 112,
      Delete: 46,
      Num1: 49,
      NumLock1: 97,
    }

    /**
     * Set scroll list select đến vị trí giá trị được chọn
     * Khắc Tiềm - 15.09.2022
     */
    watch(isShow,(newValue)=> {
      if(newValue){
        if(valueClick.value){
          setTimeout(() => {
            let indexSelect = 0;
            data.value.forEach((item: any, index: any) => {
              if(item[value.value] === valueClick.value){
                indexSelect = index;
                return;
              }
            })
            const position = listSelect.value.children[indexSelect].offsetTop;
            listSelect.value.scrollTop = position - 34;
          }, 0);
        }
      }
    })

    /**
     * nếu có sự thay đổi modelValue từ bên ngoài thì sẽ check render dropdown cho hợp lý
     * Khắc Tiềm - 15.09.2022
     */
    watch(modelValue, () => {
      if(!selectMultiple.value){
        let checkModelValueCoincideValue = false;
        data.value.forEach((item: any) => {
          if (item[value.value] === modelValue.value) {
            inputEvent.value = item[header.value];
            valueClick.value = item[value.value];
            checkModelValueCoincideValue = true;
            return;
          }
        });
        if (checkModelValueCoincideValue === false) {
          inputEvent.value = '';
          valueClick.value = undefined;
        }
        if (required.value) {
          isValid.value = false;
        }
        if(modelValue.value || modelValue.value === 0){
          let rowMap = data.value.find((item: any) => item[value.value] === modelValue.value);
          context.emit("update:textField", rowMap ? rowMap[header.value] : null);
          context.emit("update:textCode", rowMap ? rowMap[headerCode.value] : null);
        }
        else{
          context.emit("update:textField", '');
          context.emit("update:textCode", '');
        }
      }
      else{
        inputEvent.value = '';
        valueClick.value = undefined;
      }
    });

    /**
     * Chuyển props thành data
     * Khắc Tiềm - 15.09.2022
     */
    watch(data, ()=>{
      optionValue.value = [...data.value];
    })

    function preventClose(e: any){
      e.stopPropagation();
    }

    /**
     * hàm xử lý sự kiện khi nhấn nút lên hoặc nút xuống, enter và tab
     * Khắc Tiềm - 15.09.2022
     */
    const handleEnum = function (event: any) {
      if (event.keyCode === KeyCode.Up) {
        eventKeyUp()
      } else if (event.keyCode === KeyCode.Down) {
        eventKeyDown()
      }
      else if(event.keyCode === KeyCode.Back){
        eventKeyBack()
      } 
      else if (event.keyCode === KeyCode.Enter || event.keyCode === KeyCode.Tab) {
        // xử lý bấm enter
        handleSaveData(valueClick.value, true);
        toggleListSelect();
      }
    };
    /**
     * Hàm xử lý bấm lên
     */
    function eventKeyUp(){
      if(optionValue.value.length > 0){
          // xử lý bấm lên
          if (!valueClick.value && valueClick.value !== '' && valueClick.value !== 0 && optionValue.value) {
            valueClick.value = optionValue.value[0][value.value];
            inputEvent.value = optionValue.value[0][header.value];
          } else {
            for (let i = 0; i < optionValue.value.length; i++) {
              if (optionValue.value[i][value.value] === valueClick.value) {
                if (i > 0) {
                  const index = i - 1;
                  inputEvent.value = optionValue.value[index][header.value];
                  valueClick.value = optionValue.value[index][value.value];
                  const position = listSelect.value.children[i - 1].offsetTop;
                  listSelect.value.scrollTop = position - 34;
                  break;
                }
              }
            }
          }
        }
    }
    /**
     * Hàm xử lý bấm phím xuống
     */
    function eventKeyDown(){
      if(optionValue.value.length > 0){
          // xử lý bấm xuống
          if (!valueClick.value && valueClick.value !== '' && valueClick.value !== 0 && optionValue.value) {
            valueClick.value = optionValue.value[0][value.value];
            inputEvent.value = optionValue.value[0][header.value];
          } else {
            for (let i = 0; i < optionValue.value.length; i++) {
              if (optionValue.value[i][value.value] === valueClick.value) {
                if (i < optionValue.value.length - 1) {
                  const index = i + 1;
                  inputEvent.value = optionValue.value[index][header.value];
                  valueClick.value = optionValue.value[index][value.value];
                  const position = listSelect.value.children[i + 1].offsetTop;
                  listSelect.value.scrollTop = position - 34;
                  break;
                }
              }
            }
          }
        }
    }
    /**
     * Hàm xử lý bấm phím xoá
     */
    function eventKeyBack(){
      if(input.value.value === '' && selectMultiple.value && modelValue.value.length > 0){
          const data = [...modelValue.value];
          data.pop();
          context.emit("update:modelValue", data);
        }
    }

    /**
     * Hàm lưu dữ liệu
     * @param {*} valueOf 
     * @param {*} noRemove 
     */
    function handleSaveData(valueOf: any, noRemove = false){
      try {
        if(selectMultiple.value){
          if(valueOf){
            const data = [...modelValue.value]
            const index = modelValue.value.findIndex((v : any) => v === valueOf);
            if(index === -1){
              data.push(valueOf);
            }
            else{
              if(!noRemove){
                data.splice(index, 1);
              }
            }
            context.emit("update:modelValue", data);
          }
        }
      else{
        context.emit("update:modelValue", valueOf);
      }
      } catch (e) {
        console.log(e);
      }
    }

    /**
     * hàm xử lý sự kiện khi nhấn nút lên hoặc nút xuống, enter và tab
     * Khắc Tiềm - 15.09.2022
     */
    function handleBlur(){
      handleSaveData(valueClick.value);
    }

    /**
     * hàm xử lý ẩn dropdown khi click không trúng vào component
     * Khắc Tiềm - 15.09.2022
     */
    const handleClickTemplate = function (event: any) {
      const isClick = template.value.contains(event.target);
      if (!isClick) {
        if (isShow.value) {
          toggleListSelect();
        }
      }
    };

    /**
     * hàm xử lý khi người dùng click vào từng item trong dropdown
     * @param {Giá trị được chọn} value 
     * @param {Giá } index 
     * Khắc Tiềm - 15.09.2022
     */
    function handleClickItem(value: any) {
      handleSaveData(value);
      try {
        valueClick.value = value;
        if(!selectMultiple.value){
          toggleListSelect();
        }
      } catch (e) {
        console.log(e);
      }
    }

    /**
     * hàm xử lý khi người dùng focus vào ô input sẽ hiện dropdown
     * Khắc Tiềm - 15.09.2022
     */
    function handleFocusInput() {
      try {
        if (!isShow.value) {
          setPositionListSelect();
          toggleListSelect();
        }
      } catch (e) {
        console.log(e);
      }
    }

    /**
     * Giá trị tìm kiếm được lưu lại
     * Khắc Tiềm - 15.09.2022
     */
    const inputEnter: any = ref(null);
    const inputEvent: any = ref('');
    const handleSearchData = (event: any) => {
      inputEvent.value = event.target.value;
      debounce(function () {
        searchData(event);
      }, 50)
    };

    /**
     * Tìm kiếm
     * Khắc Tiềm - 15.09.2022
     */
     function searchData(event: any){
      if(optionValue.value.length > 0){
        if(event.target.value.trim() === ''){
            inputEnter.value = null;
            valueClick.value = undefined;
          }
          else if(event.data != ' '){
            let searchForName = {...optionValue.value.find((item: any) => item[header.value].toLowerCase().trim().includes(event.target.value.toLowerCase().trim()))};
            if(JSON.stringify(searchForName) === '{}' && headerCode.value){
              searchForName = {...optionValue.value.find((item: any) => item[headerCode.value].toLowerCase().trim().includes(event.target.value.toLowerCase().trim()))};
            }
            inputEnter.value = {...searchForName};
            if(inputEnter.value[value.value]){
              optionValue.value = [inputEnter.value, ...optionValue.value.filter((item: any) => item[value.value] != inputEnter.value[value.value])]
            }
            valueClick.value = inputEnter.value[value.value];
            const position = listSelect.value.children[0].offsetTop;
            listSelect.value.scrollTop = position - 34;
          }
      }
    }

    /**
     * hàm xử lý khi người dùng nhập input sẽ hiện dropdown
     * Khắc Tiềm - 15.09.2022
     */
    function handleInput(event: any) {
      try {
        handleSearchData(event);
        if (!isShow.value) {
          setPositionListSelect();
          toggleListSelect();
        }
        if(input.value.value === ''){
          context.emit("update:modelValue", null);
        }
      } catch (e) {
        console.log(e);
      }
    }

    /**
     * hàm xử lý khi người dùng bấm vào icon mở hoặc đóng dropdown
     * Khắc Tiềm - 15.09.2022
     */
    function handleClickOpenCombobox() {
      try {
        if (!isShow.value) {
          setPositionListSelect();
        }
        toggleListSelect();
        if (isShow.value) {
          input.value.focus();
        }
      } catch (e) {
        console.log(e);
      }
    }

    /**
     * Set vị trí list select hiển thị
     * Khắc Tiềm - 15.09.2022
     */
    function setPositionListSelect() {
      if(autoPosition.value){
        if(optionValue.value.length <= 5){
          if (
            window.innerHeight - (input.value.getBoundingClientRect().bottom + 30) <
              optionValue.value.length * 32 + 8
          ) {
            positionListSelect.value.top = `-${optionValue.value.length * 100 + 60}%`;
          } else {
            positionListSelect.value.top = "calc(100% + 3px)";
          }
        }
        else{
          if (
            window.innerHeight - (input.value.getBoundingClientRect().bottom + 30) <
              5 * 32 + 8
          ) {
            positionListSelect.value.top = `-${5 * 100 + 60}%`;
          } else {
            positionListSelect.value.top = "calc(100% + 3px)";
          }
        }
      }
    }

    /**
     * hàm xử lý hiển thị list select
     * Khắc Tiềm - 15.09.2022
     */
    function toggleListSelect() {
      isShow.value = !isShow.value;
      if (!noAnimation.value) {
        setTimeout(() => {
          isShowAnimation.value = !isShowAnimation.value;
        }, 0);
      }
      if (isShow.value) {
        window.addEventListener("keydown", handleEnum);
      } else {
        window.removeEventListener("keydown", handleEnum);
        optionValue.value = [...data.value];
      }
    }

    /**
     * trước khi mounted thì sẽ set giá trị cho giá trị đc click thông qua v-model hoặc defaultValue
     * Khắc Tiềm - 15.09.2022
     */
    onBeforeMount(() => {
      handleSetupData();
    });
    const handleSetupData = () => {
      data.value.forEach((item: any) => {
        if (
          item[value.value] === modelValue.value ||
          item[value.value] === defaultValue.value
        ) {
          inputEvent.value = item[header.value];
          valueClick.value = item[value.value];
          return;
        }
      });
      optionValue.value = [...data.value];
    };

    /**
     * lắng nghe sự kiện click component
     * Khắc Tiềm - 15.09.2022
     */
    onMounted(() => {
      const me: any = proxy;
      window.addEventListener("click", handleClickTemplate);
      if(me.enum){
        const source = me.$ms.commonFn.getEnumSource(me.enum);
        if(source?.length){
          me.data.push(...source);
          handleSetupData();
        }
      }
    });

    /**
     * xoá bỏ sự kiện lắng nghe
     * Khắc Tiềm - 15.09.2022
     */
    onUnmounted(() => {window.removeEventListener("click", handleClickTemplate); window.removeEventListener("keydown", handleEnum);});
    return {
      input,
      isShow,
      isShowAnimation,
      isValid,
      template,
      optionValue,
      listSelect,
      inputEvent,
      positionListSelect,
      valueClick,
      preventClose,
      handleFocusInput,
      handleClickItem,
      handleInput,
      handleClickOpenCombobox,
      handleBlur,
      handleSaveData,
    };
  },
});
</script>

<style scoped>
::-webkit-scrollbar-track {
  direction: rtl;
}

::-webkit-scrollbar-thumb {
  border-radius: 0;
  background: #b0b0b0;
}
::-webkit-scrollbar-thumb:hover {
  border-radius: 0;
  background: #808080;
}
::-webkit-scrollbar {
  height: 10px; /* height of horizontal scrollbar ← You're missing this */
  width: 8px;
  background: #ECEEF1;
}
.combobox-select.active {
  border-color: var(--primary__color);
}
.is-valid .combobox-select {
    border-color: red;
}
.combobox-select {
  position: relative;
  border: solid 1px var(--border__input);
  display: flex;
  flex-wrap: wrap;
  border-radius: 2px;
  padding: 0 37px 0px 10px;
}
.combobox-select.add-icon{
  padding: 0 73px 0px 10px;
}
.combobox-select:hover{
  box-shadow: rgb(99, 99, 99, 20%) 0px 2px 8px 0px;
}
.combobox-select.active,.input:hover {
  box-shadow: unset;
}
.input{
  border: unset;
  height: calc(var(--input__height) - 2px);
  padding: 0;
  flex: 1;
  min-width: 10px;
}
.combobox-labelName{
  background-color: #ECEEF1;
  z-index: 1;
  height: 32px;
  margin-bottom: 2px;
  font-family: "notosans-bold";
  display: flex;
  align-items: center;
  padding: 5px 10px;
}
.label-code{
  min-width: 100px;
}
.label-name{
  flex: 1;
}
.label-item + .label-item{
  padding-left: 6px;
}
.label-item{
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.combobox-select_icon {
  width: 36px;
  height: 100%;
  cursor: pointer;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  background-color: var(--while__color);
}
.icon-add{
  width: 36px;
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: var(--while__color);
  border-right: solid 1px #ccc;
  right: 36px;
  top: 0;
}
.combobox-select_icon:hover , .icon-add:hover{
  background-color: #e0e0e0;
}
.select_icon-combobox {
  background: var(--url__icon) no-repeat;
  background-position: -560px -359px;
  width: 16px;
  height: 16px;
  transition: all 0.3s ease;
}
.select_icon-add{
  width: 16px;
  height: 16px;
  transition: all 0.3s ease;
  background: var(--url__icon) no-repeat;
  background-position: -31px -312px;
}
.combobox-combobox_select {
  position: absolute;
  width: calc(100% + 2px);
  left: -1px;
  top: 130%;
  border: solid 1px var(--border__input);
  background-color: var(--while__color);
  border-radius: 2px;
  padding: 0 0 2px 0; 
  opacity: 0;
  visibility: hidden;
  z-index: 5;
  border-radius: 2px;
  transition: all 0.1s ease;
}
.combobox-combobox_select-content{
  overflow-y: auto;
  max-height: 280px;
}
.combobox-select.active .combobox-combobox_select {
  opacity: 1;
  visibility: visible;
  top: v-bind("positionListSelect.top");
}
.combobox-combobox_item {
  white-space: nowrap;
  text-align: left;
  padding: 5px 10px;
  cursor: pointer;
  height: 32px;
  color: inherit;
  display: flex;
  position: relative;
  align-items: center;
}
.combobox-combobox_item:hover:not(.combobox-combobox_item.active), .select-multiple .combobox-combobox_item.active:hover{
  background-color: #ebedf0 !important;
  color: var(--primary__color) !important;
}
.combobox-combobox_item.hover{
  background-color: #ebedf0 !important;
  color: var(--primary__color) !important;
}
.combobox-select.active .select_icon-combobox {
  transform: rotate(180deg);
}
.combobox-combobox_item.active {
  background-color: var(--primary__color);
  color: var(--while__color);
}
.select-multiple .combobox-combobox_item.active {
  background-color: unset;
  color: inherit;
  padding-right: 26px;
}
.select-multiple .combobox-combobox_item.active::before{
  content: '';
  width: 16px;
  height: 16px;
  background: var(--url__icon) no-repeat;
  background-position: -896px -312px;
  position: absolute;
  right: 10px;
}
.select-multiple_list{
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-width: 100%;
}
.selected-text{
  white-space: nowrap;
}
.selected-item{
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 3px;
  background-color: #f0f0f0;
  padding: 2px 3px 2px 5px;
  margin: 3px;
  text-overflow: ellipsis;
}
.selected-icon{
  margin-left: 4px;
  width: 16px;
  height: 16px;
  min-width: 16px;
  min-height: 16px;
  cursor: pointer;
  background: var(--url__icon2) no-repeat;
  background-position: -80px -312px;
}
</style>
