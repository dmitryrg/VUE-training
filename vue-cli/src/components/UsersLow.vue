<template>
  <div>
    <form @change="amountChoiced">
      <select name="choiceAmount">
        <!--<option v-for="(amount, index) of possibleAmounts" :key="index" :value="index">-->
        <option v-for="amount of possibleAmounts" :key="amount" :value="amount">
          {{ amount }}
        </option>
      </select>
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
    <div>
      <span
        v-for="page of allPages"
        :key="page"
        :class="{ 'active-page': page === currentPage, 'common-page': true }"
        @click="pageChoice(page)"
        >{{ page }}</span
      >
    </div>
  </div>
</template>

<script>
import { makeUrlImage, makePathUser } from '@/functions/paths.js'
import config from '@/config.js'

export default {
  name: 'UsersLow',
  props: {
    users: {
      type: Array,
      required: true
    }
  },
  data: () => {
    return {
      possibleAmounts: config.paging.possibleAmountOnPage,
      rowOnPage: config.paging.possibleAmountOnPage[0],
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
      while (i * this.rowOnPage < this.users.length) {
        allPages.push(i + 1)
        i++
      }

      return allPages
    }
  },
  methods: {
    makeUrlImage,
    makePathUser,
    checkChildMethod() {
      alert('checkChildMethod works!')
    },
    amountChoiced(event) {
      // this.rowOnPage = this.possibleAmounts[event.target.value]
      this.rowOnPage = event.target.value
      this.currentPage = 1
    },
    pageChoice(pageNumber) {
      this.currentPage = pageNumber
    }
  }
}
</script>

<style scoped>
img {
  width: 50px;
}
.common-page {
  margin: 30px 10px;
  padding: 5px 30px;
  background: #d7f0f3;
  /*text-decoration: underline;*/
}
.common-page:hover {
  background: #dcdcdc;
  cursor: pointer;
}
.active-page {
  /*text-decoration: none;*/
  background: #ffd6d6;
}
</style>
