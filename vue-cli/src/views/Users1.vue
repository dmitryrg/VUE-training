<template>
  <div>
    <div v-show="isVisible">
      <h4>
        <!--Количество пользователей {{amountUsersMethods()}}-->
        Количество пользователей {{ amountUsersComputed }}
      </h4>
      <tag-users-1 :users2="users1">
        <!--        <template slot="table-header">

        </template>
        <template slot="table-row" slot-scope="{ user1 }">

        </template>
        <template v-slot:button-area="{ checkChildMethod1 }">
          <button v-show="false" type="button" @click="checkChildMethod1">checkChildMethod</button>
        </template>-->
      </tag-users-1>
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
const DEFAULT_IMAGE = './avatars/default.png'
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
    fillVal(val) {
      return val ? `.${val}` : DEFAULT_IMAGE
    },
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
  margin: 20px 5px;
}
img {
  width: 50px;
}
</style>
