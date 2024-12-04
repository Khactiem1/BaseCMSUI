<template>
  <div class="calendar-container ms-datepicker">
    <label v-if="label">{{ label }}</label>
    <div class="form-input" :class="{ 'is-valid': (new Date(modelValue || '') > (maxDate || '')) && maxDate}">
      <input
        :disabled="disabled"
        @keypress="isNumber($event)"
        @blur="handleSave()"
        ref="elementInput"
        type="text"
        :tabindex="tabindex"
        placeholder="DD/MM/YYYY"
        class="input"
        v-model="displayData"
        @input="handleInput"
      />
      <span class="message-valid">{{ messageValid }}</span>
      <div
        ref="elementIcon"
        @click="handleShowCalendar()"
        class="form-icon"
        :class="{ disabled: disabled }"
      ></div>
    </div>
    <div ref="elementCalendar" v-show="showCalendar" class="calendar">
      <div class="calendar-item calendar-date">
        <div class="info">
          <div
            @click="handlePrevMonth()"
            class="calendar-prev btn-handle"
          ></div>
          <span
            @click="showSelectYear = true"
            style="font-family: notosans-bold">
            {{ $t('i18nControl.calendar.month') }} {{ currentMonth + 1}}
            {{ $t('i18nControl.calendar.year') }} {{ currentYear }}</span
          >
          <div
            @click="handleNextMonth()"
            class="calendar-next btn-handle"
          ></div>
        </div>
        <div class="date">
          <div class="day-name">{{$t('i18nControl.calendar.t')}}2</div>
          <div class="day-name">{{$t('i18nControl.calendar.t')}}3</div>
          <div class="day-name">{{$t('i18nControl.calendar.t')}}4</div>
          <div class="day-name">{{$t('i18nControl.calendar.t')}}5</div>
          <div class="day-name">{{$t('i18nControl.calendar.t')}}6</div>
          <div class="day-name">{{$t('i18nControl.calendar.t')}}7</div>
          <div class="day-name">{{$t('i18nControl.calendar.su')}}</div>
        </div>
        <div class="date date-container">
          <div v-for="(item, index) in startDay" class="day" :key="index"></div>
          <div
            v-for="(item, index) in daysInMonth"
            @click="handleSelectDate(item)"
            class="day day-value"
            :key="index"
            :class="{
              active:
                currentDate === item &&
                new Date(modelValue || '').getMonth() === currentMonth &&
                new Date(modelValue || '').getFullYear() === currentYear,
              'date-now':
                dateNow.getDate() === item &&
                dateNow.getMonth() === currentMonth &&
                dateNow.getFullYear() === currentYear,
            }"
          >
            {{ item }}
          </div>
        </div>
        <div class="info today">
          <span @click="handleSelectDate(true)">{{ $t('i18nControl.calendar.today') }}</span>
        </div>
        <div
          v-show="showSelectMonth"
          ref="elementSelectMonth"
          class="calendar-item calendar-month"
        >
          <div class="calendar-select_header">
            <div @click="currentYear--" class="calendar-prev btn-handle"></div>
            <span
              style="cursor: pointer"
              @click="
                showSelectMonth = false;
                showSelectYear = true;
              "
              >{{ currentYear }}</span
            >
            <div @click="currentYear++" class="calendar-next btn-handle"></div>
          </div>
          <div class="calendar-select_content month">
            <div
              v-for="(item, index) in 12"
              :key="index"
              class="calendar-select_item"
            >
              <span @click="handleSelectMonth(item)">{{ $t('i18nControl.calendar.thg') }} {{ item }}</span>
            </div>
          </div>
          <div class="calendar-cancel">
            <span @click="handleShowCalendar()">{{ $t('i18nCommon.cancel') }}</span>
          </div>
        </div>
        <div
          v-show="showSelectYear"
          ref="elementSelectYear"
          class="calendar-item calendar-year"
        >
          <div class="calendar-select_header">
            <div
              @click="currentYear = currentYear - 12"
              class="calendar-prev btn-handle"
            ></div>
            <span>{{ currentYear }} - {{ currentYear - 11 }}</span>
            <div
              @click="currentYear = currentYear + 12"
              class="calendar-next btn-handle"
            ></div>
          </div>
          <div class="calendar-select_content year">
            <div
              v-for="(item, index) in 12"
              :key="index"
              class="calendar-select_item"
              :class="{ active: currentYear === currentYear - item + 1 }"
            >
              <span @click="handleSelectYear(currentYear - item + 1)">{{
                currentYear - item + 1
              }}</span>
            </div>
          </div>
          <div class="calendar-cancel">
            <span @click="handleShowCalendar()">{{ $t('i18nCommon.cancel') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, watch, onUnmounted, onBeforeMount, getCurrentInstance } from "vue";

export default defineComponent({
  props: {
    modelValue: { default: (): any => '' },
    tabindex: {
      default: 0
    },
    label: {},
    messageValid: {},
    maxDate: {},
    disabled: {
      default: false
    },
  },
  setup(props, context) { 
    const { proxy } : any = getCurrentInstance();

    /**
     * Element calendar chọn ngày, tháng, năm
     * Khắc Tiềm - 15.09.2022
     */
    const elementCalendar:any = ref(null);
    /**
     * Element icon toggle ẩn hiện calendar
     * Khắc Tiềm - 15.09.2022
     */
    const elementIcon: any = ref(null);
    /**
     * Element chọn tháng
     * Khắc Tiềm - 15.09.2022
     */
    const elementSelectMonth:any = ref(null);
    /**
     * Element chọn năm
     * Khắc Tiềm - 15.09.2022
     */
    const elementSelectYear: any = ref(null);
    /**
     * Element thẻ input
     * Khắc Tiềm - 15.09.2022
     */
    const elementInput:any = ref(null);
    /**
     * Trạng thái show calendar
     * Khắc Tiềm - 15.09.2022
     */
    const showCalendar = ref(false);
    /**
     * Trạng thái show năm
     * Khắc Tiềm - 15.09.2022
     */
    const showSelectYear = ref(false);
    /**
     * Trạng thái show tháng
     * Khắc Tiềm - 15.09.2022
     */
    const showSelectMonth = ref(false);
    /**
     * Biến lưu ngày hiện tại
     * Khắc Tiềm - 15.09.2022
     */
    const dateNow = ref(new Date());
    /**
     * Model value truyền từ props
     * Khắc Tiềm - 15.09.2022
     */
    const { modelValue, disabled }: any = toRefs(props);
    /**
     * Dữ liệu hiển thị lên ui
     * Khắc Tiềm - 15.09.2022
     */
    const displayData = ref("");
    /**
     * Dữ liệu hiển thị lên ui khi đang nhập
     * Khắc Tiềm - 15.09.2022
     */
    const dataInput = ref("__/__/____");
    /**
     * Biến lưu ngày được chọn
     * Khắc Tiềm - 15.09.2022
     */
    const currentDate = computed(() =>
      modelValue.value ? new Date(modelValue.value).getDate() : null
    );
    /**
     * Biến lưu tháng được chọn
     * Khắc Tiềm - 15.09.2022
     */
    const currentMonth = ref(
      modelValue.value
        ? new Date(modelValue.value).getMonth()
        : new Date().getMonth()
    );
    /**
     * Biến lưu năm được chọn
     * Khắc Tiềm - 15.09.2022
     */
    const currentYear = ref(
      modelValue.value
        ? new Date(modelValue.value).getFullYear()
        : new Date().getFullYear()
    );
    onBeforeMount(()=> {
      if(modelValue.value){
        displayData.value = proxy.$ms.format.formatDateTimeFull(new Date(modelValue.value), 'DD/MM/YYYY');
      }
    });
    /**
     * Kiểm tra nếu có sự thay đổi của model value thì render lại giao diện
     * Khắc Tiềm - 15.09.2022
     */
    watch(modelValue, (newValue: any) => {
      currentMonth.value = newValue
        ? new Date(newValue).getMonth()
        : new Date().getMonth();
      currentYear.value = newValue
        ? new Date(newValue).getFullYear()
        : new Date().getFullYear();
      if(!newValue){
        enteredValue.value = "";
        doneValue.value = 0;
      }
      else{
        doneValue.value = 2;
      }
      displayData.value = modelValue.value
        ? proxy.$ms.format.formatDateTimeFull(new Date(modelValue.value), 'DD/MM/YYYY')
        : "";
      enteredValue.value = modelValue.value
        ? proxy.$ms.format.formatDateTimeFull(new Date(modelValue.value), 'DD/MM/YYYY')
        : "";
    });
    /**
     * Tháng bắt đầu render
     * Khắc Tiềm - 15.09.2022
     */
    const daysInMonth = computed(() =>
      new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
    );
    /**
     * Ngày bắt đầu render
     * Khắc Tiềm - 15.09.2022
     */
    const startDay = computed(() =>
      new Date(currentYear.value, currentMonth.value, 0).getDay()
    );
    /**
     * Hàm xử lý quay lại tháng
     * Khắc Tiềm - 15.09.2022
     */
    function handlePrevMonth() {
      if (currentMonth.value == 0) {
        currentMonth.value = 11;
        currentYear.value--;
      } else {
        currentMonth.value--;
      }
    }
    /**
     * Hàm xử lý next tháng
     * Khắc Tiềm - 15.09.2022
     */
    function handleNextMonth() {
      if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value++;
      } else {
        currentMonth.value++;
      }
    }
    /**
     * Hàm xử lý chọn năm
     * Khắc Tiềm - 15.09.2022
     */
    function handleSelectYear(year: any) {
      currentYear.value = year;
      showSelectYear.value = false;
      showSelectMonth.value = true;
    }
    /**
     * Hàm xử lý chọn tháng
     * Khắc Tiềm - 15.09.2022
     */
    function handleSelectMonth(month: any) {
      currentMonth.value = month - 1;
      showSelectMonth.value = false;
    }
    /**
     * Hàm xử lý chọn ngày
     * Khắc Tiềm - 15.09.2022
     */
    function handleSelectDate(dateSelect: any) {
      let d;
      if (dateSelect === true) {
        d = new Date();
      } else {
        d = new Date(currentYear.value, currentMonth.value, dateSelect);
      }
      context.emit("update:modelValue", proxy.$ms.format.formatDateTimeFull(d, 'YYYY-MM-DD'));
      handleShowCalendar();
    }
    /**
     * Hàm xử lý ẩn calendar khi click ra ngoài calendar
     * Khắc Tiềm - 15.09.2022
     */
    const handleClickTemplate = (event: any) => {
      const isClickElementCalendar = elementCalendar.value.contains(event.target);
      const isClickElementIcon = elementIcon.value.contains(event.target);
      const isClickElementSelectMonth = elementSelectMonth.value.contains(event.target);
      const isClickElementSelectYear = elementSelectYear.value.contains(event.target);
      if (!isClickElementCalendar && !isClickElementIcon && !isClickElementSelectMonth && !isClickElementSelectYear ) 
      {
        handleShowCalendar();
      }
    };
    /**
     * Khi Unmounted thì sẽ xoá bỏ sự kiện xử lý ẩn calendar khi click ra ngoài calendar
     * Khắc Tiềm - 15.09.2022
     */
    onUnmounted(()=> {
      window.removeEventListener("click", handleClickTemplate);
    });
    /**
     * Hàm xử lý ẩn hiện calendar
     * Khắc Tiềm - 15.09.2022
     */
    function handleShowCalendar() {
      if(!disabled.value){
        if (showCalendar.value) {
          showSelectYear.value = false;
          showSelectMonth.value = false;
          window.removeEventListener("click", handleClickTemplate);
        } else {
          window.addEventListener("click", handleClickTemplate);
        }
        showCalendar.value = !showCalendar.value;
      }
    }
    /**
     * Biến chứa thông tin ngày đã nhập
     * Khắc Tiềm - 15.09.2022
     */
    const enteredValue: any = ref("");
    /**
     * Biến chứa trạng thái nhập ngày, tháng, năm
     * Khắc Tiềm - 15.09.2022
     */
    const doneValue = ref(0);
    /**
     * Hàm xử lý sự kiện khi nhập vào ô input ngày
     * Khắc Tiềm - 15.09.2022
     */
    function handleInput(event: any) {
      if(event.data && elementInput.value.selectionStart <= 10){
        if(elementInput.value.selectionStart > enteredValue.value.length){
          if(elementInput.value.selectionStart === 3 || elementInput.value.selectionStart === 6){
            enteredValue.value +=  '/' + event.data;
            doneValue.value++;
          }
          else{
            enteredValue.value += event.data;
          }
          displayData.value = enteredValue.value + dataInput.value.slice(elementInput.value.selectionStart, dataInput.value.length);
          setTimeout(() => {
            elementInput.value.selectionStart = elementInput.value.selectionEnd = displayData.value.replace(/[^0-9]/g,"").length + doneValue.value;
            if(elementInput.value.selectionStart === 10){
              const d = new Date(enteredValue.value.split("/")[2], enteredValue.value.split("/")[1] - 1, enteredValue.value.split("/")[0]);
              context.emit("update:modelValue", proxy.$ms.format.formatDateTimeFull(d, 'YYYY-MM-DD'));
            }
          }, 0);
        }
      }
      else if(!event.data){
        if(elementInput.value.selectionStart === 3 || elementInput.value.selectionStart === 6){
          enteredValue.value = enteredValue.value.substring(0, enteredValue.value.length - 1);
          displayData.value = displayData.value.substring(0, displayData.value.length - 1);
          doneValue.value--;
        }
        enteredValue.value = enteredValue.value.substring(0, enteredValue.value.length - 1);
      }
      else{
        displayData.value = enteredValue.value;
      }
    }
    /**
     * Hàm xử lý lưu dữ liệu khi nhập tay
     * Khắc Tiềm - 15.09.2022
     */
    function handleSave(){
      if(displayData.value === ""){
        context.emit("update:modelValue", undefined);
      }
      displayData.value = modelValue.value
        ? proxy.$ms.format.formatDateTimeFull(new Date(modelValue.value), 'DD/MM/YYYY')
        : "";
      enteredValue.value = modelValue.value
        ? proxy.$ms.format.formatDateTimeFull(new Date(modelValue.value), 'DD/MM/YYYY')
        : "";
      if(!modelValue.value){
        enteredValue.value = "";
        doneValue.value = 0;
      }
      else{
        doneValue.value = 2;
      }
    }
    /**
     * Hàm xử lý chỉ cho phép nhập số
     * Khắc Tiềm - 15.09.2022
     */
    function isNumber(evt: any) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();
      } else {
        return true;
      }
    }
    return {
      currentMonth,
      currentYear,
      daysInMonth,
      displayData,
      startDay,
      dateNow,
      currentDate,
      showSelectMonth,
      showSelectYear,
      elementCalendar,
      elementIcon,
      elementSelectMonth,
      elementSelectYear,
      elementInput,
      showCalendar,
      isNumber,
      handleSave,
      handleNextMonth,
      handlePrevMonth,
      handleSelectYear,
      handleSelectMonth,
      handleSelectDate,
      handleShowCalendar,
      handleInput,
    };
  },
});
</script>

<style lang="scss" scoped>
.calendar-container {
  position: relative;
}
.form-input {
  position: relative;
}
.form-icon {
  position: absolute;
  background: var(--url__icon);
  background-position: -118px -305px;
  width: 36px;
  padding: 4px 10px;
  height: calc(100% - 2px);
  right: 1px;
  top: 1px;
  background-color: #fff;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
}
.form-icon:hover {
  background-color: #e0e0e0;
  cursor: pointer;
}
*,
*::after,
*::before {
  white-space: nowrap;
}
.calendar {
  width: 300px;
  background-color: #fff;
  position: absolute;
  z-index: 4;
  right: 0;
}
.calendar-select_content {
  display: flex;
  position: relative;
  padding: 16px 12px 12px 12px;
  flex-wrap: wrap;
  border-top-left-radius: 22px;
  border-top-right-radius: 22px;
}
.calendar-select_content::before {
  position: absolute;
  top: -8px;
  content: "";
  width: 0px;
  left: 50%;
  transform: translateX(-50%);
  height: 0px;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #31af21;
}
.calendar-date {
  width: 100%;
  position: relative;
}
.calendar-month,
.calendar-year {
  display: flex;
  flex-direction: column;
  padding: 0 12px;
  width: calc(100% - 24px);
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
.calendar-select_item {
  width: calc(100% / 4);
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "notosans-bold";
  border-radius: 4px;
}
.calendar-select_item span {
  padding: 8px 4px;
  display: inline-block;
  width: 48px;
  border-radius: 3px;
  text-align: center;
  cursor: pointer;
}
.calendar-select_item.active span {
  background-color: #fff;
  border-radius: 20px;
  color: #31af21;
}
.calendar-select_item span:hover {
  background-color: #fff;
  border-radius: 3px;
  color: #31af21;
}
.calendar-select_content.month {
  background-color: #31af21;
  color: #fff;
}
.calendar-select_content.year {
  background-color: #31af21;
  color: #fff;
}
.calendar-cancel {
  background-color: #31af21;
  border-bottom-left-radius: 22px;
  border-bottom-right-radius: 22px;
  margin-bottom: 12px;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  color: #fff;
  font-family: "notosans-bold";
}
.calendar-cancel span {
  margin-top: -35px;
  padding: 8px 10px;
  display: inline-block;
  border-radius: 3px;
  text-align: center;
  cursor: pointer;
}
.calendar-cancel span:hover {
  background-color: #309124;
}
.calendar-select_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  font-family: "notosans-bold";
}
.btn-handle {
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.calendar-item.calendar-date {
  border: 1px solid #ccc;
  padding: 0 12px;
  z-index: 1;
  border-radius: 4px;
}
.calendar-item.calendar-month {
  z-index: 2;
  border-radius: 4px;
  background-color: #fff;
}
.calendar-item.calendar-year {
  z-index: 3;
  border-radius: 4px;
  background-color: #fff;
}
.info {
  display: flex;
  justify-content: space-between;
  padding: 12px 20px 8px 20px;
  align-items: center;
}
.info span {
  cursor: pointer;
}
.info.today {
  justify-content: center;
  padding-bottom: 12px;
  color: var(--primary__color);
}
.date {
  display: flex;
  border-bottom: solid 1px #ccc;
  flex-wrap: wrap;
  padding: 4px 0 8px 0;
}
.day,
.day-name {
  width: calc(100% / 7 - 2px);
  margin: 1px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid #fff;
  color: #757575;
}
.day {
  height: 36px;
}
.day-name {
  margin-top: 14px;
  height: 24px;
  font-family: "notosans-bold";
}
.day.day-value:hover {
  border-color: #309124;
}
.day.day-value {
  cursor: pointer;
}
.calendar-next::before {
  content: "\2192";
}
.calendar-prev::before {
  content: "\2190";
}
.day.active {
  background-color: #d5ecd2;
  color: var(--primary__color);
}
.day.date-now {
  color: var(--primary__color);
  font-family: "notosans-semibold";
}
.message-valid {
  top: 118%;
}
.disabled{
  background-color: #EFF0F2 !important;
  cursor: unset !important;
}
</style>