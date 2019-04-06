<template lang="pug">
  div
    tag-combobox(v-model='selectRowsPerPage')
    table.table.table-hover(v-show='isListReady')
      thead
        slot(name='table-header')
          tr
            th
              span  #
            th
              span Имя
            th
              span Фамилия
            th
              span Дата регистрации
            th
              span Аватар
        slot(:checkChildMethodTop='checkChildMethod' name='button-area')
      tbody
        router-link(v-for='user of shownUsers' :key='user.id' :to='makePathUser(user)' tag='tr')
          slot(:user='user' name='table-row')
            td
              span  {{ user.id }}
            td
              span  {{ user.firstName }}
            td
              span  {{ user.lastName }}
            td
              span  {{ user.registered }}
            td
              img(:src='makeUrlImage(user.avatar)')
    tag-pagination(v-model='selectPage' :amountRowsAll='users.length' :amountRowsPerPage='amountRowsPerPage')
</template>

<script>
import { makeUrlImage, makePathUser } from '@/functions/paths.js'
import config from '@/config.js'
import Combobox from '@/components/combobox.vue'
import Pagination from '@/components/pagination.vue'

export default {
  name: 'UsersLow',
  components: {
    'tag-combobox': Combobox,
    'tag-pagination': Pagination
  },
  props: {
    users: {
      type: Array,
      required: true
    }
  },
  data: () => {
    return {
      possibleAmounts: config.possibleAmountOnPage,
      amountRowsPerPage: config.possibleAmountOnPage[0],
      numberCurrentPage: 1
    }
  },
  computed: {
    isListReady() {
      return this.users.length > 0
    },
    shownUsers() {
      if (this.isListReady) {
        return this.users.filter(
          (elem, index) =>
            index < this.numberCurrentPage * this.amountRowsPerPage &&
            index >= (this.numberCurrentPage - 1) * this.amountRowsPerPage
        )
      } else {
        return []
      }
    },
    selectRowsPerPage: {
      get() {
        return this.possibleAmounts
      },
      set(amountRows) {
        this.amountRowsPerPage = Number(amountRows)
      }
    },
    selectPage: {
      get() {
        return this.numberCurrentPage
      },
      set(pageNumber) {
        this.numberCurrentPage = pageNumber
      }
    }
  },
  watch: {
    amountRowsPerPage: 'resetNumberCurrentPage'
  },
  methods: {
    makeUrlImage,
    makePathUser,
    checkChildMethod() {
      alert('checkChildMethod works!')
    },
    resetNumberCurrentPage() {
      this.numberCurrentPage = 1
    }
  }
}
</script>

<style scoped>
img {
  width: 50px;
}
</style>
