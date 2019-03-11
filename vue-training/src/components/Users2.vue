<template>
  <table v-show="isListReady">
    <tr v-for="user of users2" :key="user.id">
      <td v-for="(val, key) in user" :key="key">
        <img v-if="key === 'avatar' && val" :src="val" />
        <img v-else-if="key === 'avatar'" src="./avatars/default.png" />
        <span v-else> {{ val | toUpperCase }}</span>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'Users2',
  filters: {
    toUpperCase: function(value) {
      if (!value && value !== 0) return ''
      value = value.toString()
      return value.toUpperCase()
    }
  },
  props: {
    users2: {
      type: Array,
      required: true
    }
  },
  computed: {
    isListReady() {
      return !!this.users2.length
    }
  }
}
</script>

<style scoped></style>
