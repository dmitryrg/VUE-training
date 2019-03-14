<template>
  <table v-show="isListReady" class="table table-hover">
    <thead>
      <tr>
        <th v-for="(val, key) in users2[0]" :key="key">
          <span> {{ key }}</span>
        </th>
      </tr>
    </thead>
    <tbody>
      <router-link v-for="user of users2" :key="user.id" :to="makePathUser(user)" tag="tr">
        <td v-for="(val, key) in user" :key="key">
          <img v-if="key === 'avatar'" :src="fillVal(val)" />
          <span v-else> {{ val | toUpperCase }}</span>
          <!--<span> {{ val }}</span>-->
        </td>
      </router-link>
    </tbody>
  </table>
</template>

<script>
const DEFAULT_IMAGE = './avatars/default.png'
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
  },
  methods: {
    fillVal(val) {
      return val ? val : DEFAULT_IMAGE
    },
    makePathUser(user) {
      return '/user/' + user.id
    }
  }
}
</script>

<style scoped>
img {
  width: 50px;
}
</style>
