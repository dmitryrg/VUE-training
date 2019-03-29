<template>
  <div>
    <tag-user-low :userTop="user" :isCardReady="isCardReady" @update-user-top="updateUser">
      <template slot="my-slot-name">
        <div>
          <button v-show="!isNew" type="button" class="btn btn-secondary" @click="addAvatar">
            {{ hasAvatar ? 'change' : ' add' }}
          </button>
        </div>
        <div>
          <button
            v-show="hasAvatar && !isNew"
            type="button"
            class="btn btn-secondary"
            @click="delAvatarButton"
          >
            del
          </button>
        </div>
      </template>
    </tag-user-low>

    <button type="button" class="btn btn-primary" @click="goBack">Back</button>
    <button type="button" class="btn btn-success" @click="saveUser">Save</button>
    <button v-show="!isNew" type="button" class="btn btn-danger" @click="delUser">Del</button>

    <input v-show="false" ref="sadDialog" type="file" @change="fileChoiced" />

    <!--    <pre>
      {{ user }}
    </pre>-->
  </div>
</template>

<script>
import axios from 'axios'
import UserLow from '@/components/UserLow.vue'
import { userEmpty } from '@/functions/data.js'

// const xhr = new XMLHttpRequest()

const API_SERVER = 'http://localhost:3001'
// const API_SERVER = 'https://api.limestudio.ru/apiservervue'
const PICTURE_DIR = '/avatars'

export default {
  name: 'UserTop',
  components: {
    'tag-user-low': UserLow
  },
  data: () => {
    return {
      user: {}
    }
  },
  computed: {
    idUser() {
      return this.$route.params.idPath
    },
    isNew() {
      return this.idUser === 'new'
    },
    isCardReady() {
      return !!Object.keys(this.user).length
    },
    hasAvatar() {
      return !!this.user['avatar']
    }
  },
  mounted() {
    // для случая когда новый пользователь
    if (this.isNew) {
      this.user = Object.assign({}, userEmpty)
      return
    }

    this.loadUser()
  },
  methods: {
    goBack() {
      this.$router.push({ path: '/users' })
    },
    updateUser(userLow) {
      // с нижнего уровня вылетел юзер 2 и мы его загоняем в юзер 1
      this.user = userLow
    },
    loadUser() {
      axios
        .get(API_SERVER + '/users/' + this.idUser)
        .then(response => response.data)
        .then(user => (this.user = user))
        .catch(err => alert(err.message))
    },
    saveUser() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) {
          alert('не заполнено одно из полей')
          return
        }
        if (this.isNew) {
          axios
            .post(API_SERVER + '/users', this.user)
            .then(() => {
              // если запущена по клику, то прилетит событие
              if (event) this.$router.push({ path: '/users' })
            })
            .catch(err => alert(err.message))
        } else {
          // редактирование существующего пользователя
          axios
            .put(API_SERVER + '/users/' + this.idUser, this.user)
            .then(() => {
              if (event) this.$router.push({ path: '/users' })
            })
            .catch(err => alert(err.message))
        }
      })
    },
    delUser() {
      axios
        .delete(API_SERVER + '/users/' + this.idUser)
        .then(() => this.$router.push({ path: '/users' }))
        .catch(err => alert(err.message))
    },
    addAvatar() {
      // по кнопке вызываем клик на диалоге запроса файла
      this.$refs.sadDialog.click()
    },
    delAvatarButton() {
      this.delAvatarApi(this.user['avatar'])
      this.user['avatar'] = ''
    },
    delAvatarApi(filenameAvatar) {
      axios
        .delete(API_SERVER + '/picture' + filenameAvatar)
        .then(() => this.saveUser())
        .catch(err => alert(err.message))
    },
    fileChoiced() {
      // после завершения диалога у нас файл выбран
      // this.$refs.sadDialog.files[0]
      // this.$refs.sadDialog.value - имя файл
      // const fileSend = new FormData()
      // fileSend.append('image', this.$refs.sadDialog.files[0])

      const fileNameChoiced = this.$refs.sadDialog.value
      const extname = fileNameChoiced.substring(fileNameChoiced.lastIndexOf('.') + 1)
      const fileNameCreating = `${PICTURE_DIR}/${this.idUser}-${Date.now()}.${extname}`
      console.log('fileNameCreating ->', fileNameCreating) // debug
      axios
        .post(API_SERVER + '/picture' + fileNameCreating, this.$refs.sadDialog.files[0])
        .then(response => {
          let prevAvatar = null
          if (this.hasAvatar) prevAvatar = this.user['avatar']
          // в юзере путь в аватаре хранится без точки
          this.user['avatar'] = response.data.link
          this.$refs.sadDialog.value = ''

          if (prevAvatar) {
            this.delAvatarApi(prevAvatar)
          } else {
            this.saveUser()
          }
        })
        .catch(err => alert(err.message))
    }
  }
}
</script>

<style scoped>
button {
  margin: 5px;
  width: 80px;
}
</style>
