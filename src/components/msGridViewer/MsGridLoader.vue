<template>
  <tbody>
    <tr v-for="(row, indexRow) in lengthList === 0 ? 3 : lengthList" :key="indexRow">
      <td>
        <div class="table-loader">
          <span></span>
        </div>
      </td>
      <td v-for="(item, index) in columns" :key="index">
        <div class="table-loader">
          <span></span>
        </div>
      </td>
      <td>
        <div class="table-loader">
          <span></span>
        </div>
      </td>
    </tr>
  </tbody>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    /**
     * column cần hiển thị
     */
    columns: {
      type: Array,
    },
    /**
     * độ dài muốn hiển thị
     */
    lengthList: {},
  },
});
</script>

<style scoped>
/* Table loader */
table {
  border-collapse: collapse;
  width: 100%;
}
tbody td {
  padding: 0 10px;
  min-height: 44px;
  height: 44px;
  border-right: 1px dotted #c7c7c7;
  border-bottom: 1px solid #c7c7c7;
}
.table-loader span {
  width: 100%;
  height: 16px;
  display: block;
  animation: pulse-bg 1s infinite;
}
.table .thead-light th:last-child,
.table .thead-light th:first-child {
  background-color: #e5e8ec;
  z-index: 1;
}
.table .thead-light th:last-child,
.table tbody th:last-child,
.table tbody td:last-child {
  right: 15px !important;
}
.table .thead-light th:first-child,
.table tbody th:first-child,
.table tbody td:first-child {
  left: 16px;
}
.table .thead-light th:first-child::before,
.table tbody th:first-child::before,
.table tbody td:first-child::before {
  content: "";
  left: -16px;
  top: 0;
  width: 16px;
  height: 110%;
  position: absolute;
  background-color: var(--while__color);
}
.table .thead-light th:last-child::before,
.table tbody th:last-child::before,
.table tbody td:last-child::before {
  content: "";
  right: -16px;
  top: 0;
  width: 16px;
  height: 110%;
  position: absolute;
  background-color: var(--while__color);
}
.table .thead-light th:last-child,
.table .thead-light th:first-child,
.table tbody th:last-child,
.table tbody th:first-child,
.table tbody td:last-child,
.table tbody td:first-child {
  position: -webkit-sticky;
  position: sticky;
}
.table tbody th:last-child,
.table tbody th:first-child,
.table tbody td:last-child,
.table tbody td:first-child {
  background-color: var(--while__color);
}
@keyframes pulse-bg {
  0% {
    background-color: #eee;
  }
  50% {
    background-color: #cfcfcf;
  }
  100% {
    background-color: #eee;
  }
}
</style>
