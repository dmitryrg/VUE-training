<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <div v-show="isVisible">
      <h4>
        <!--Количество пользователей {{amountUsersMethods()}}-->
        Количество пользователей {{ amountPhones }}
      </h4>
      <tag-users-low :users="phones">
        <template slot="table-header">
          <tr>
            <th><span> #</span></th>
            <th><span>Имя</span></th>
            <th><span>Фамилия</span></th>
            <th><span>Телефон</span></th>
          </tr>
        </template>
        <template slot="table-row" slot-scope="{ user }">
          <td>
            <span> {{ user.id }}</span>
          </td>
          <td>
            <span> {{ user.firstName }}</span>
          </td>
          <td>
            <span> {{ user.lastName }}</span>
          </td>
          <td>
            <span> {{ user.phone }}</span>
          </td>
        </template>
        <template slot="button-area" slot-scope="{ checkChildMethodTop }">
          <!--<template v-slot:button-area="{ checkChildMethodTop }"> // не работает после изменения версии вью-->
          <button type="button" @click="checkChildMethodTop">checkChildMethod</button>
        </template>
      </tag-users-low>
    </div>
  </div>
</template>

<script>
import UsersLow from '@/components/UsersLow.vue'
import config from '@/config.js'

import axios from 'axios'

export default {
  name: 'Phones',
  components: {
    'tag-users-low': UsersLow
  },
  data: function() {
    return {
      phones: [],
      isVisible: true,
      tooltip: 'всплывающая подсказка'
    }
  },
  computed: {
    amountPhones() {
      return this.phones ? this.phones.length : 0
    }
  },
  mounted() {
    this.loadPhones()
  },
  methods: {
    async loadPhones() {
      try {
        this.phones = (await axios.get(config.serverApi + '/users')).data
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
