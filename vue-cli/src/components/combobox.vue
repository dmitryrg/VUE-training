<template>
  <select @change="$emit('choice-done', $event.target.value)">
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
  }
}
</script>

<style scoped></style>
