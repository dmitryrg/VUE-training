<template>
  <div>
    <!--<input type="text" v-model="rowOnPage" />-->
    <form @change="amountChoiced">
      <p>
        <select name="choiceAmount">
          <option v-for="(amount, index) of possibleAmounts" :key="index" :value="index">{{
            amount
          }}</option>
        </select>
      </p>
    </form>

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

        <slot name="button-area" :checkChildMethod1="checkChildMethod2"> </slot>
      </thead>
      <tbody>
        <router-link
          v-for="user2 of shownUsers2"
          :key="user2.id"
          :to="makePathUser(user2)"
          tag="tr"
        >
          <slot name="table-row" :user1="user2">
            <td>
              <span> {{ user2.id }}</span>
            </td>
            <td>
              <span> {{ user2.firstName }}</span>
            </td>
            <td>
              <span> {{ user2.lastName }}</span>
            </td>
            <td>
              <span> {{ user2.registered | formatDate }}</span>
            </td>
            <td><img :src="makeUrlImage(user2.avatar)" /></td>
          </slot>
        </router-link>
      </tbody>
    </table>
    <div>
      <span
        v-for="page of allPages"
        :key="page"
        :class="isActive(page)"
        @click="pageChoice(page)"
        >{{ page }}</span
      >
    </div>
  </div>
</template>

<script>
// const DEFAULT_IMAGE = './avatars/default.png'
import { formatDate } from '@/functions/formatters.js'
import { makeUrlImage, makePathUser } from '@/functions/paths.js'
import config from '@/config.js'

export default {
  name: 'Users2',
  filters: {
    formatDate
  },
  props: {
    users2: {
      type: Array,
      required: true
    }
  },
  data: () => {
    return {
      possibleAmounts: config.paging.possibleAmountOnPage,
      rowOnPage: config.paging.possibleAmountOnPage[config.paging.defaultAmountOnPageIndex],
      currentPage: config.paging.defaultStartPage
    }
  },
  computed: {
    isListReady() {
      return !!this.users2.length
    },
    shownUsers2() {
      if (this.isListReady) {
        return this.users2.filter(
          (elem, index) =>
            index < this.currentPage * this.rowOnPage &&
            index >= (this.currentPage - 1) * this.rowOnPage
        )
      } else {
        return []
      }
    },
    allPages() {
      const allPages = []

      let i = 0
      while (i * this.rowOnPage < this.users2.length) {
        allPages.push(i + 1)
        i++
      }

      return allPages
    }
  },
  methods: {
    makeUrlImage,
    makePathUser,
    checkChildMethod2() {
      alert('checkChildMethod works!')
    },
    amountChoiced(event) {
      this.rowOnPage = this.possibleAmounts[event.target.value]
      this.currentPage = config.paging.defaultStartPage
    },
    pageChoice(pageNumber) {
      this.currentPage = pageNumber
    },
    isActive(page) {
      if (page == this.currentPage) return 'active-page-select'
      else return 'passive-page-select'
    }
  }
}
</script>

<style scoped>
img {
  width: 50px;
}
.active-page-select,
.passive-page-select {
  margin: 30px 10px;
  padding: 5px 30px;
}
.passive-page-select {
  background: #d7f0f3;
  text-decoration: underline;
}
.active-page-select {
  text-decoration: none;
  background: #ffd6d6;
}
</style>
