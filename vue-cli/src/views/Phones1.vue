<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <div v-show="isVisible">
      <h4>
        <!--Количество пользователей {{amountUsersMethods()}}-->
        Количество пользователей {{ amountPhones }}
      </h4>
      <tag-users-1 :users2="phones1">
        <template slot="table-header">
          <tr>
            <th><span> #</span></th>
            <th><span>Имя</span></th>
            <th><span>Фамилия</span></th>
            <th><span>Телефон</span></th>
          </tr>
        </template>
        <template slot="table-row" slot-scope="{ user1 }">
          <td>
            <span> {{ user1.id }}</span>
          </td>
          <td>
            <span> {{ user1.firstName }}</span>
          </td>
          <td>
            <span> {{ user1.lastName }}</span>
          </td>
          <td>
            <span> {{ user1.phone }}</span>
          </td>
        </template>
        <template v-slot:button-area="{ checkChildMethod1 }">
          <button type="button" @click="checkChildMethod1">checkChildMethod</button>
        </template>
      </tag-users-1>
    </div>
  </div>
</template>

<script>
import Users2 from '@/components/Users2.vue'
import config from '@/config.js'

import axios from 'axios'

export default {
  name: 'Phones1',
  components: {
    'tag-users-1': Users2
  },
  data: function() {
    return {
      phones1: [],
      isVisible: true,
      tooltip: 'всплывающая подсказка'
    }
  },
  computed: {
    amountPhones() {
      return this.phones1 ? this.phones1.length : 0
    }
  },
  mounted() {
    this.loadPhones()
  },
  methods: {
    async loadPhones() {
      try {
        this.phones1 = (await axios.get(config.serverApi + '/users')).data
      } catch (err) {
        alert(err.message)
      }
    }
  }
}
</script>

<style scoped>
button {
  margin: 5px;
}
img {
  width: 50px;
}
</style>
