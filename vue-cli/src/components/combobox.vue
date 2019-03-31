<template>
  <select :style="backgroundImageArrow" @change="$emit('choice-done', $event.target.value)">
    <option v-for="item of list" :key="item" :value="item">
      {{ item }}
    </option>
  </select>
</template>

<script>
import config from '@/config.js'
export default {
  name: 'Combobox',
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  computed: {
    backgroundImageArrow() {
      return `background-image: url(${config.serverStatic}${
        config.cssImagesDir
      }/selectMarker.jpeg);`
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
</style>
