<template lang="pug">
div
  div
    h4 Количество пользователей {{ amountUsersComputed }}
    tag-users-low(:users="users")
  button.btn.btn-success(type="button" @click="addUser") Add
</template>

<script>
import UsersLow from '@/components/UsersLow.vue'

import axios from 'axios'
import config from '@/config.js'

export default {
  name: 'UsersTop',
  components: {
    'tag-users-low': UsersLow
  },
  data: () => {
    return {
      users: []
    }
  },
  computed: {
    amountUsersComputed() {
      return this.users ? this.users.length : 0
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      axios
        .get(config.serverApi + '/users')
        .then(response => response.data)
        .then(users => (this.users = users))
    },
    addUser() {
      this.$router.push({ path: '/users/new' })
    }
  }
}
</script>

<style scoped>
button {
  margin: 20px 5px;
}
img {
  width: 50px;
}
</style>
