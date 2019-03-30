<template>
  <div>
    <span
      v-for="page in Math.ceil(amountRows / rowsOnPage)"
      :key="page"
      :class="{ 'active-page': page === currentPage, 'common-page': true }"
      @click="$emit('page-choiced', page)"
    >
      {{ page }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    amountRows: {
      type: Number,
      required: true
    },
    rowsOnPage: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>
.common-page {
  margin: 30px 10px;
  padding: 5px 30px;
  background: #d7f0f3;
}
.common-page:hover {
  background: #dcdcdc;
  cursor: pointer;
}
.active-page {
  background: #ffd6d6;
}
</style>
