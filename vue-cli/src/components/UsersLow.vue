<template>
  <div>
    <tag-combobox :list="possibleAmounts" @choice-done="amountChoiced"> </tag-combobox>
    <table v-show="isListReady" class="table table-hover">
      <thead>
        <slot name="table-header">
          <tr>
            <th><span> #</span></th>
            <th><span>Имя</span></th>
            <th><span>Фамилия</span></th>
            <th><span>Регистрация</span></th>
            <th><span>Аватар</span></th>
          </tr>
        </slot>

        <slot :checkChildMethodTop="checkChildMethod" name="button-area"></slot>
      </thead>
      <tbody>
        <router-link v-for="user of shownUsers" :key="user.id" :to="makePathUser(user)" tag="tr">
          <slot :user="user" name="table-row">
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
              <span> {{ user.registered }}</span>
            </td>
            <td><img :src="makeUrlImage(user.avatar)" /></td>
          </slot>
        </router-link>
      </tbody>
    </table>
    <tag-pagination
      :amountRows="users.length"
      :rowsOnPage="rowsOnPage"
      :currentPage="currentPage"
      @page-choiced="pageChoiced"
    ></tag-pagination>
    <!--@page-choiced ="currentPage = $event"-->
  </div>
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
      rowsOnPage: config.possibleAmountOnPage[0],
      currentPage: 1
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
            index < this.currentPage * this.rowsOnPage &&
            index >= (this.currentPage - 1) * this.rowsOnPage
        )
      } else {
        return []
      }
    }
  },
  methods: {
    makeUrlImage,
    makePathUser,
    checkChildMethod() {
      alert('checkChildMethod works!')
    },
    amountChoiced(amountRows) {
      this.rowsOnPage = Number(amountRows)
      this.currentPage = 1
    },
    pageChoiced(pageNumber) {
      this.currentPage = pageNumber
    }
  }
}
</script>

<style scoped>
img {
  width: 50px;
}
</style>
