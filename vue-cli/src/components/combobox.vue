<template>
  <select :class="classUsed" @change="$emit('choice-done', $event.target.value)">
    <option v-for="item of list" :key="item" :value="item">
      {{ item }}
    </option>
  </select>
</template>

<script>
export default {
  name: 'Combobox',
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    urlArrow: 'http://localhost:8080/avatars/selectMarker.jpeg'
  }),
  computed: {
    classUsed() {
      return process.env.NODE_ENV
    }
  }
}
</script>

<style scoped>
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none; /* remove default arrow */
  width: 55px;
  height: 30px;
  font-size: 16px;
  border: 1px solid #ccc;
  padding: 0 10px;
}
.development {
  background-image: url('http://localhost:8080/avatars/selectMarker.jpeg'); /* add custom arrow */
}
.production {
  background-image: url('https://api.limestudio.ru/avatars/selectMarker.jpeg'); /* add custom arrow */
}
</style>
