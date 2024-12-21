<template>
  <div class="show-paging">
    <div class="show-paging_item" 
      @click="previousPage"
      :class="{ disabled : disablePrevPage }">{{ $t('i18nCommon.prev') }}
    </div>
    <div 
      class="show-paging_item show-paging_text"
      :class="{ active: pageIndex == 1 }"
      @click="loadPageIndex(1)"
    >
      1
    </div>
    <div v-if="pageIndex > 3" class="show-paging_item show-paging_text">...</div>
    <div 
      v-for="item in pageIndexs" 
      :key="item"
      class="show-paging_item show-paging_text"
      @click="loadPageIndex(item)"
      :class="{active : pageIndex === item}"
    >
      {{ item }}
    </div>
    <div v-if="pageIndex <= totalPages - 3" class="show-paging_item show-paging_text">...</div>
    <div
      class="show-paging_item show-paging_text"
      v-if="totalPages > 1"
      :class="{
        active: pageIndex == totalPages,
      }"
      @click="loadPageIndex(totalPages)"
    >
      {{ totalPages }}
    </div>
    <div 
      class="show-paging_item" 
      @click="nextPage"
      :class="{ disabled : disableNextPage }"
    >
      {{ $t('i18nCommon.next') }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance } from "vue";

export default defineComponent({
  props: {
    pageSize: {
      type: Number,
      default: 50
    },
    pageTotal: {
      type: Number,
      default: 0
    },
    pageIndex: {
      default: 1,
      type: Number,
    },
  },
  emits: ["load-page-index"],
  setup() {
    const { proxy }: any = getCurrentInstance();

    /**
     * Số page render tự động
     */
    const pageIndexs = computed(() => {
      const me: any = proxy;
      let ps = [];
      // Nếu trang hiện tại > 2 thì bắt đầu từ pageIndex - 1 còn nếu < 3 thì nút bắt đầu là 2
      let start = me.pageIndex > 2 ? me.pageIndex - 1 : 2;
      // Nút kết thúc < tổng số trang - 2 thì nút kết thúc là giá trị trang hiện tại + 1 còn nếu không thì tổng số trang - 1
      let end =
        me.pageIndex < me.totalPages - 2
          ? me.pageIndex + 1
          : me.totalPages - 1;

      // Đẩy vào mảng ps chứa các nút được phép hiển thị khi phân trang
      for (let i = start; i <= end; i++) ps.push(i);
      return ps;
    });

    /**
     * Tổng số trang theo pageSize hiện tại của grid
     */
    const totalPages = computed(() => {
      const me: any = proxy;
      return Math.ceil(me.pageTotal / me.pageSize);
    });

    /**
     * Thực hiện quay về trang trước
     */
    const previousPage = () => {
      const me: any = proxy;
      if (!me.disablePrevPage) {
        me.loadPageIndex(me.pageIndex - 1);
      }
    }

    /**
     * Thực hiện đi tới trang kế tiếp
     */
    const nextPage = () => {
      const me: any = proxy;
      if (!me.disableNextPage) {
        me.loadPageIndex(me.pageIndex + 1);
      }
    };

    /**
     * Thực hiện load đến trang số chỉ định
     */
    const loadPageIndex = (index: any) => {
      const me: any = proxy;
      me.$emit('load-page-index', Number(index));
    };

    /**
     * Thực hiện disablePrevPage
     */
    const disablePrevPage = computed(() => {
      const me: any = proxy;
      if (me.pageIndex <= 1) {
        return true;
      }
      return false;
    });

    /**
     * Thực hiện disableNextPage
     */
    const disableNextPage = computed(() => {
      const me: any = proxy;
      if (me.pageIndex >= me.totalPages) {
        return true;
      }
      return false;
    });
    
    return {
      totalPages,
      pageIndexs,
      disablePrevPage,
      disableNextPage,
      nextPage,
      loadPageIndex,
      previousPage,
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
