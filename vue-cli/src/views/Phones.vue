<template lang="pug">
  div
    h4 Количество телефонов {{ amountPhones }}
    h6
      label  Имя группы:
      input(v-model="nameGroup" type="text")
    tag-users-low(:users="phones")
      template(slot="table-header")
        tr
          th
            span  #
          th
            span Имя
          th
            span Фамилия
          th
            span Телефон
      template(slot="table-row" slot-scope="{ user }")
        td
          span  {{ user.id }}
        td
          span  {{ user.firstName }}
        td
          span  {{ user.lastName }}
        td
          span  {{ user.phone }}
      template(slot="button-area" slot-scope="{ checkChildMethodTop }")
        button(type="button" @click="checkChildMethodTop") checkChildMethod
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
