<template>
  <table v-show="isListReady" class="table table-hover">
    <thead>
      <tr>
        <th><span> #</span></th>
        <th><span>Имя</span></th>
        <th><span>Фамилия</span></th>
        <th><span>Отчество</span></th>
        <th><span>Аватар</span></th>
      </tr>
    </thead>
    <tbody>
      <router-link v-for="user of users2" :key="user.id" :to="makePathUser(user)" tag="tr">
        <td>
          <span> {{ user.firstName }}</span>
        </td>
        <td>
          <span> {{ user.lastName }}</span>
        </td>
        <td>
          <span> {{ user.patronymic }}</span>
        </td>
        <td><img :src="fillVal(user.avatar)" /></td>
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
      return '/users/' + user.id
    }
  }
}
</script>

<style scoped>
img {
  width: 50px;
}
</style>
