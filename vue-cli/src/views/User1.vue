<template>
  <div>
    <tag-user-1
      :user2="user1"
      :is-card-ready2="isCardReady1"
      @update-user="updateUser1"
    ></tag-user-1>
    <button type="button" class="btn btn-primary" @click="goBack">Back</button>
    <button type="button" class="btn btn-success" @click="save">Save</button>
    <button v-show="!isNew" type="button" class="btn btn-danger" @click="del">Del</button>
    <pre>
      {{ user1 }}
    </pre>
  </div>
</template>

<script>
import axios from 'axios'
import User2 from '@/components/User2.vue'

// const xhr = new XMLHttpRequest()

const API_SERVER = 'http://localhost:3001'
// const API_SERVER = 'https://api.limestudio.ru/apiservervue'

export default {
  name: 'User1',
  components: {
    'tag-user-1': User2
  },
  data: function() {
    return {
      user1: {}
    }
  },
  computed: {
    idUser() {
      return this.$route.params.idPath
    },
    isNew() {
      return this.idUser === 'new'
    },
    isCardReady1() {
      return !!Object.keys(this.user1).length
    }
  },
  mounted() {
    // для случая когда новый пользователь
    if (this.isNew) {
      this.user1 = {
        firstName: '',
        lastName: '',
        patronymic: '',
        avatar: ''
      }
      return
    }

    this.load()
  },
  methods: {
    goBack() {
      this.$router.push({ path: '/users' })
    },
    updateUser1(localUser2) {
      // с нижнего уровня вылетел юзер 2 и мы его загоняем в юзер 1
      this.user1 = localUser2
    },
    load() {
      /*      xhr.open('GET', API_SERVER + '/users/' + this.idUser)
      xhr.send()
      xhr.onload = () => {
        this.user1 = JSON.parse(xhr.responseText)
      }*/
      axios
        .get(API_SERVER + '/users/' + this.idUser)
        .then(response => response.data)
        .then(user => (this.user1 = user))
        .catch(err => alert(err.message))
    },
    save() {
      if (this.isNew) {
        // добавление нового пользователя

        /*        xhr.open('POST', API_SERVER + '/users')
        xhr.setRequestHeader('Content-type', 'application/json')
        xhr.send(JSON.stringify(this.user1))
        xhr.onload = () => {
          console.log(' post xhr.responseText ->', xhr.responseText) // debug
        }*/

        axios
          .post(API_SERVER + '/users', this.user1)
          .then(() => this.$router.push({ path: '/users' }))
          .catch(err => alert(err.message))
      } else {
        // редактирование существующего пользователя
        axios
          .put(API_SERVER + '/users/' + this.idUser, this.user1)
          .then(() => this.$router.push({ path: '/users' }))
          .catch(err => alert(err.message))
      }
    },
    del() {
      axios
        .delete(API_SERVER + '/users/' + this.idUser)
        .then(() => this.$router.push({ path: '/users' }))
        .catch(err => alert(err.message))
    }
  }
}
</script>

<style scoped>
button {
  margin: 5px;
}
</style>
