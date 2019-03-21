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
            <td><img :src="fillVal(user2.avatar)" /></td>
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
const DEFAULT_IMAGE = './avatars/default.png'
import { formatDate } from '@/functions/formatters.js'

const DEFAULT_START_PAGE = 1
const POSSIBLE_AMOUNT_ON_PAGE = [10, 20, 50]
const DEFAULT_AMOUNT_ON_PAGE_INDEX = 0

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
      possibleAmounts: POSSIBLE_AMOUNT_ON_PAGE,
      rowOnPage: POSSIBLE_AMOUNT_ON_PAGE[DEFAULT_AMOUNT_ON_PAGE_INDEX],
      currentPage: DEFAULT_START_PAGE
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
    fillVal(val) {
      return val ? `.${val}` : DEFAULT_IMAGE
    },
    makePathUser(user) {
      return '/users/' + user.id
    },
    checkChildMethod2() {
      alert('checkChildMethod works!')
    },
    amountChoiced(event) {
      this.rowOnPage = this.possibleAmounts[event.target.value]
      this.currentPage = DEFAULT_START_PAGE
    },
    pageChoice(pageNumber) {
      this.currentPage = pageNumber
    },
    isActive(page) {
      if (page == this.currentPage) return 'active'
      else return ''
    }
  }
}
</script>

<style scoped>
img {
  width: 50px;
}
div > span {
  margin: 30px 10px;
  padding: 5px 30px;
  background: #d7f0f3;
  text-decoration: underline;
}
.active {
  text-decoration: none;
  background: #ffd6d6;
}
</style>
