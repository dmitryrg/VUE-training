<template>
  <div v-show="isVisible">
    <h4>
      <!--Количество пользователей {{amountUsersMethods()}}-->
      Количество пользователей {{ amountUsersComputed }}
    </h4>
    <tag-users-1 :users2="users1"> </tag-users-1>
  </div>

  <!--<button type="button" @click="triggerShowHide" v-tooltip.right="tooltip">change visible</button>-->
</template>

<script>
import Users2 from '@/components/Users2.vue'
// import users0 from '@/views/users.js'

import axios from 'axios'

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
    axios
      .get('http://127.0.0.1:3000/api/users')
      .then(response => response.data)
      .then(users => this.users1 = users);

    console.log('load users ->', this.users1) // debug
  },
  methods: {
    triggerShowHide() {
      this.isVisible = !this.isVisible
    }
    /*                    amountUsersMethods () {
                                return this.users ? this.users.length : 0
                            }*/
  }
}
</script>

<style scoped></style>
