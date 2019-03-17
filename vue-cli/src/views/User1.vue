<template>
  <div>
    <tag-user-1
      :user2="user1"
      :is-card-ready2="isCardReady1"
      @update-user="updateUser1"
    ></tag-user-1>
    <button type="button" class="btn btn-primary" @click="goBack">Back</button>
    <button type="button" class="btn btn-success" @click="save">Save</button>
    <button type="button" class="btn btn-danger" @click="del">Del</button>
    <pre>
      {{ user1 }}
    </pre>
  </div>
</template>

<script>
import axios from 'axios'
import User2 from '@/components/User2.vue'

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
    isCardReady1() {
      return !!Object.keys(this.user1).length
    }
  },
  mounted() {
    // для случая когда нет id-шника нет надобности получать данные, но надо установить формат объекта
    if (!this.idUser && this.idUser !== 0) {
      this.user1 = {
        firstName: '',
        lastName: '',
        patronymic: '',
        avatar: ''
      }
      return
    }

    axios
      .get('http://127.0.0.1:3000/api/user/' + this.idUser)
      .then(response => response.data)
      .then(user => (this.user1 = user))
      .catch(err => alert(err.message))
  },
  methods: {
    goBack() {
      this.$router.push({ path: '/users' })
    },
    /*    changeUser() {
      this.user1 = { firstName: 'Inan' }
    },*/
    updateUser1(localUser2) {
      this.user1 = localUser2
    },
    save() {
      if (!this.idUser && this.idUser !== 0) {
        // добавление нового пользователя
        console.log('this.user1 ->', this.user1) // debug
        axios({
          method: 'post',
          url: 'http://127.0.0.1:3000/api/user/',
          data: this.user1
        })
          .then(response => console.log(response.data))
          .catch(err => alert(err.message))
        // this.$router.push({ path: '/users' })

        /*
        axios
          .post('http://127.0.0.1:3000/api/user/', this.user1)*/
      } else {
        // редактирование существующего пользователя
        axios
          .put('http://127.0.0.1:3000/api/user/' + this.idUser, this.user1)
          .then(response => console.log(response.data))
          .catch(err => alert(err.message))
      }
    },
    del() {
      axios
        .delete('http://127.0.0.1:3000/api/user/' + this.idUser)
        .then(response => console.log(response.data))
        .catch(err => alert(err.message))
      // this.$router.push({ path: '/users' })
    }
  }
}
</script>

<style scoped>
button {
  margin: 5px;
}
</style>
