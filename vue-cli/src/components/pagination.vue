<template>
  <div>
    <span
      v-for="numberPage in Math.ceil(passParams.amountRowsAll / passParams.amountRowsPerPage)"
      :key="numberPage"
      :class="{
        'active-number-page': numberPage === passParams.numberCurrentPage,
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
  model: {
    prop: 'passParams',
    event: 'page-choiced'
  },
  props: {
    passParams: {
      type: Object,
      require: true,
      default: () => ({
        amountRowsAll: 0,
        amountRowsPerPage: 0,
        numberCurrentPage: 0
      })
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
