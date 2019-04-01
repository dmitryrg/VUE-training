<template>
  <div>
    <span
      v-for="numberPage in Math.ceil(amountRowsAll / amountRowsPerPage)"
      :key="numberPage"
      :class="{
        'active-number-page': numberPage === numberCurrentPage,
        'common-number-page': true
      }"
      @click="$emit('page-choiced', numberPage)"
    >
      {{ numberPage }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    amountRowsAll: {
      type: Number,
      required: true
    },
    amountRowsPerPage: {
      type: Number,
      required: true
    },
    numberCurrentPage: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>
.common-number-page {
  margin: 30px 10px;
  padding: 5px 30px;
  background: #d7f0f3;
}
.common-number-page:hover {
  background: #dcdcdc;
  cursor: pointer;
}
.active-number-page {
  background: #ffd6d6;
}
</style>
