<template>
  <div>
    <div v-show="isVisible">
      <h4>
        <!--Количество пользователей {{amountUsersMethods()}}-->
        Количество пользователей {{ amountUsersComputed }}
      </h4>
      <tag-users-1 :users2="users1"></tag-users-1>
    </div>
    <!--<button type="button" class="btn btn-primary" @click="triggerShowHide">change visible</button>-->
    <button type="button" class="btn btn-success" @click="addUser">Add</button>
  </div>
</template>

<script>
import Users2 from '@/components/Users2.vue'
// import users0 from '@/views/users.js'

import axios from 'axios'

// const xhr = new XMLHttpRequest()

const API_SERVER = 'http://localhost:3001'
// const API_SERVER = 'https://api.limestudio.ru/apiservervue'

export default {
  name: 'Users1',
  components: {
    'tag-users-1': Users2
  },
  data: function() {
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
      /*      xhr.open('GET', API_SERVER + '/users')
      xhr.send()
      xhr.onload = () => {
        this.users1 = JSON.parse(xhr.responseText)
      }*/

      axios
        .get(API_SERVER + '/users')
        .then(response => response.data)
        .then(users => (this.users1 = users))
    },
    triggerShowHide() {
      this.isVisible = !this.isVisible
    },
    addUser() {
      this.$router.push({ path: '/users/new' })
    }
    /*                    amountUsersMethods () {
                                return this.users ? this.users.length : 0
                            }*/
  }
}
</script>

<style scoped>
button {
  margin: 5px;
}
</style>
