<template>
  <div>
    <div v-show="isVisible">
      <h4>
        <!--Количество пользователей {{amountUsersMethods()}}-->
        Количество пользователей {{ amountUsersComputed }}
      </h4>
      <tag-users-1 :users2="users1"> </tag-users-1>
    </div>
    <button type="button" class="btn btn-success" @click="addUser">Add</button>
  </div>
</template>

<script>
import Users2 from '@/components/Users2.vue'
// import users0 from '@/views/users.js'

import axios from 'axios'
import config from '@/config.js'
// const xhr = new XMLHttpRequest()

// import { formatDate } from '@/functions/formatters.js'

export default {
  name: 'Users1',
  filters: {
    // formatDate
  },
  components: {
    'tag-users-1': Users2
  },
  data: () => {
    return {
      users1: [],
      isVisible: true,
      tooltip: 'всплывающая подсказка'
    }
  },
  computed: {
    amountUsersComputed() {
      return this.users1 ? this.users1.length : 0
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      /*      xhr.open('GET', config.serverApi + '/users')
      xhr.send()
      xhr.onload = () => {
        this.users1 = JSON.parse(xhr.responseText)
      }*/

      axios
        .get(config.serverApi + '/users')
        .then(response => response.data)
        .then(users => (this.users1 = users))
    },
    triggerShowHide() {
      this.isVisible = !this.isVisible
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
