<template>
  <div>
    <div>
      <h4>
        <!--Количество пользователей {{amountUsersMethods()}}-->
        Количество актуальных телефонов {{ amountPhones }}
      </h4>
      <h6>
        <label> Имя группы: </label>
        <input v-model="nameGroup" type="text" />
        <!--        :value="$store.state.nameGroup"
        @input="$store.commit('setNameGroup', $event.target.value)"-->
      </h6>
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
          <!--                  <template v-slot:button-area="{ checkChildMethodTop }">-->
          <button type="button" @click="checkChildMethodTop">checkChildMethod</button>
        </template>
      </tag-users-low>
    </div>
  </div>
</template>

<script>
import UsersLow from '@/components/UsersLow.vue'

export default {
  name: 'Phones',
  components: {
    'tag-users-low': UsersLow
  },
  computed: {
    // тут стрелки нельзя, поскольку дыс есть
    amountPhones() {
      return this.phones.length
    },
    phones() {
      return this.$store.getters.activePhones
    },
    nameGroup: {
      get() {
        return this.$store.state.nameGroup
      },
      set(value) {
        this.$store.commit('setNameGroup', value)
      }
    }
  },
  mounted() {
    this.$store.dispatch('loadPhones')
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
label {
  margin: 10px;
}
</style>
