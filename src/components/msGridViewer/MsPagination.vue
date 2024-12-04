<template>
  <div class="show-paging">
    <div class="show-paging_item" 
      @click="handlePrevPage()"
      :class="{ disabled : currentPage === 1 }">{{ $t('i18nCommon.prev') }}</div>
    <div 
      v-for="(item, index) in displayPaging" 
      :key="index"
      @click="handleChangePage(item)"
      class="show-paging_item show-paging_text"
      :class="{active : currentPage === item}"
    >
      {{ item }}
    </div>
    <div class="show-paging_item" 
      @click="handleNextPage()"
      :class="{ disabled : currentPage === Math.ceil(totalCount / countRecordPageRecord) }"
    >
    {{ $t('i18nCommon.next') }}
    </div>
  </div>
</template>

<script lang="ts">
import { toRefs, ref, computed, defineComponent } from "vue";

export default defineComponent({
  props: ["value", "totalCount", "countRecordPageRecord"],
  emits: ["custom-handle-select-paging"],
  setup(props, context) {
    /**
     * Trang hiện tại đứng
     * NK Tiềm 7/10/2022
     */
    const currentPage = ref(1);

    /**
     * Trang hiển thị thay đổi
     * NK Tiềm 7/10/2022
     */
    const pageChangeCLick = ref(3);

    /**
     * props truyền vào là lượng muốn lấy và số tổng danh sách
     * NK Tiềm 7/10/2022
     */
    const { countRecordPageRecord, totalCount } = toRefs(props);

    // watch(value, (newValue) => {
    //   currentPage.value = (newValue / countRecordPageRecord.value) + 1;
    // })

    /**
     * Danh sách mảng hiển thị lên giao diện
     * NK Tiềm 7/10/2022
     */
    const displayPaging = computed(()=> {
      const arr = [];
      for(let i = 1; i <= Math.ceil(totalCount.value / countRecordPageRecord.value); i++){
        if(currentPage.value === Math.ceil(totalCount.value / countRecordPageRecord.value) - 1 || currentPage.value === Math.ceil(totalCount.value / countRecordPageRecord.value)){
          if(i === Math.ceil(totalCount.value / countRecordPageRecord.value)){
            arr.push(i);
          }
          else if(i === 3){
            if(Math.ceil(totalCount.value / countRecordPageRecord.value) === 4){
              arr.push(i);
            }
            else{
              arr.push("...");
            }
          }
          else if(i < 4){
            arr.push(i);
          }
          else if(i === 4){
            arr.push(pageChangeCLick.value);
          }
        }
        else{
          if(i === Math.ceil(totalCount.value / countRecordPageRecord.value)){
            arr.push(i);
          }
          else if(i === 3){
            arr.push(pageChangeCLick.value);
          }
          else if(i < 4){
            arr.push(i);
          }
          else if(i === 4){
            arr.push("...");
          }
        }
      }
      return arr;
    });

    /**
     * Hàm xử lý chọn trang
     * NK Tiềm 7/10/2022
     * @param {Biến nhận vào là trang muốn lấy} page 
     */
    async function handleChangePage(page: any){
      try {
        if(page === "..."){
          if(currentPage.value === Math.ceil(totalCount.value / countRecordPageRecord.value) - 1 || currentPage.value === Math.ceil(totalCount.value / countRecordPageRecord.value)){
            handlePrevPage();
          }
          else{
            handleNextPage();
          }
        }
        else{
          await context.emit("custom-handle-select-paging", page);
          currentPage.value = page;
          if(page === Math.ceil(totalCount.value / countRecordPageRecord.value)){
            pageChangeCLick.value = currentPage.value - 1;
          }
          else if(page === Math.ceil(totalCount.value / countRecordPageRecord.value) - 1){
            pageChangeCLick.value = currentPage.value;
          }
          else{
            pageChangeCLick.value = 3;
          }
        }
      } catch (e) {
        console.log(e);
      }
    }

    /**
     * Hàm xử lý quay lại trang
     * NK Tiềm 7/10/2022
     */
    function handlePrevPage(){
      try {
        if(currentPage.value > 1){
          if(currentPage.value > 3 && currentPage.value < Math.ceil(totalCount.value / countRecordPageRecord.value)){
            pageChangeCLick.value = currentPage.value - 1;
          }
          currentPage.value -= 1;
          context.emit("custom-handle-select-paging", currentPage.value);
        }
      } catch (e) {
        console.log(e);
      }
    }
    
    /**
     * Hàm xử lý next trang
     * NK Tiềm 7/10/2022
     */
    function handleNextPage(){
      try {
        if(currentPage.value < Math.ceil(totalCount.value / countRecordPageRecord.value)){
          if(currentPage.value >= 3 && currentPage.value < Math.ceil(totalCount.value / countRecordPageRecord.value) - 1){
            pageChangeCLick.value = currentPage.value + 1;
          }
          currentPage.value += 1;
          context.emit("custom-handle-select-paging", currentPage.value);
        }
      } catch (e) {
        console.log(e);
      }
    }
    return {
      currentPage,
      displayPaging,
      handleChangePage,
      handlePrevPage,
      handleNextPage,
    };
  },
});
</script>

<style scoped>
.show-paging {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16px;
}
.show-paging_item {
  cursor: pointer;
}
.show-paging_item.disabled {
  color: #9e9e9e;
  cursor: context-menu;
}
.show-paging_text {
  padding: 0 6px;
}
.show-paging_text.active {
  border: solid 1px var(--border__input);
  padding: 0 0.5rem;
  font-weight: bold;
}
.show-paging_item:last-child {
  margin-left: 6px;
}
.show-paging_item:first-child {
  margin-right: 6px;
}
</style>
