<template>
  <table v-show="isCardReady2" class="table table-hover">
    <tbody>
      <tr v-for="(val, key) in user2" :key="key">
        <td>
          {{ key }}
        </td>
        <td>
          <!--<span> {{ val }}</span>-->
          <img v-if="key === 'avatar'" :src="fillVal(val)" />
          <span v-else-if="key === 'id'"> {{ val }}</span>
          <input v-else type="text" :value="val" @input="val = $event.target.value" />
          <!--<input v-else v-model="val" type="text" />-->
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
const DEFAULT_IMAGE = './avatars/default.png'
export default {
  name: 'User2',
  props: {
    user2: {
      type: Object,
      required: true
    }
  },
  computed: {
    isCardReady2() {
      return !!this.user2.firstName
    }
  },
  methods: {
    fillVal(val) {
      return val ? val : DEFAULT_IMAGE
    }
  }
}
</script>

<style scoped>
img {
  width: 100px;
}
</style>
