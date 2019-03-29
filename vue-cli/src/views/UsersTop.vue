<template>
  <div>
    <div>
      <h4>
        <!--Количество пользователей {{amountUsersMethods()}}-->
        Количество пользователей {{ amountUsersComputed }}
      </h4>
      <tag-users-low :users="users"> </tag-users-low>
    </div>
    <button type="button" class="btn btn-success" @click="addUser">Add</button>
  </div>
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
