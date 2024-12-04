<template>
  <div class="form-key-search">
    <div
      class="filter-item"
      v-for="(item, index) in dataBindFilter"
      :key="index"
    >
      <span> 
        {{ item.headerCustom && item.headerCustom.trim() !== '' ? item.headerCustom : $t(item.header) }}
        {{ item.filter?.comparisonType?.enumText }}{{ item.filter?.value != null && item.filter?.value != undefined ? `: ${$ms.commonFn.processDataaGridViewer(item, item.filter?.value)}`: '' }}
      </span>
      <div
        @click="handleDeleteFilterItem(item)"
        class="delete-filter-icon"
      ></div>
    </div>
    <div
      @click="handleDeleteFilterItem()"
      class="filter-item delete-filter-item"
      v-if="dataBindFilter.length > 0"
    >
      <span>{{ $t('i18nControl.MsGridViewer.remove_search') }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, computed } from "vue";

export default defineComponent({
  props: {
    grid: {
      type: Object,
      default: {},
    }
  },
  setup(props){
    const { proxy }: any = getCurrentInstance();

    /**
     * Cột đang được filter
     * @author nktiem 03.12.2024
     */
    const dataBindFilter = computed(() => {
      const me: any = proxy;
      if(me.grid?.columnx?.length){
        let columns: any [] = me.grid.columnx.filter((_: any) => _.filter);
        return columns;
      }
      return [];
    });

    /**
     * Xoá lọc 1 cột nào đó
     * @param col = null thì có nghĩa là xoá all
     */
    const handleDeleteFilterItem = (col: any = null) => {
      const me: any = proxy;
      if(col){
        col.filter = null;
      }
      else{
        let columns: any [] = me.grid.columnx.filter((_: any) => _.filter);
        columns.forEach((c: any) => {
          c.filter = null;
        });
      }
      me.$emit('loadData');
    };

    return{
      dataBindFilter,
      handleDeleteFilterItem,
    }
  },
});
</script>

<style scoped>
  
.form-key-search{
  display: flex;
    align-items: center;
    flex-wrap: wrap;
}
.filter-item{
    display: flex;
    align-items: center;
    position: relative;
    color: #0075c0;
    margin-left: 6px;
    white-space: nowrap;
  }
  .delete-filter-icon{
    background: var(--url__icon);
    background-position: -80px -312px;
    margin-left: 3px;
    width: 16px;
    height: 16px;
    margin-top: 2px;
    min-width: 16px;
    min-height: 16px;
    cursor: pointer;
  }
  .delete-filter-item{
    cursor: pointer;
  }
  .delete-filter-item:hover{
    text-decoration: underline
  }
</style>
