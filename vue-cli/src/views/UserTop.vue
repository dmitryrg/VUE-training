<template>
  <div>
    <tag-user-low :userTop="user" :isCardReady="isCardReady" @update-user-top="updateUser">
      <template slot="button-avatar">
        <div>
          <button v-show="!isNew" type="button" class="btn btn-secondary" @click="setAvatar">
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
    <button type="button" class="btn btn-success" @click="saveUser(true)">Save</button>
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
import { userEmpty, userNewAdd } from '@/functions/data.js'
import config from '@/config.js'
import { copyObj } from '@/functions/deep.js'

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
      return Object.keys(this.user).length > Object.keys(userEmpty).length
    },
    hasAvatar() {
      return !!this.user['avatar']
    }
  },
  mounted() {
    // для случая когда новый пользователь
    if (this.isNew) {
      this.user = Object.assign({}, userEmpty, userNewAdd)
      return
    }

    this.loadUser()
  },
  methods: {
    goBack() {
      this.$router.push({ path: '/users' })
    },
    updateUser(userLow) {
      // с нижнего уровня вылетел юзер и мы его загоняем в верхний юзер
      this.user = copyObj(userLow)
    },
    loadUser() {
      axios
        .get(config.serverApi + '/users/' + this.idUser)
        .then(response => response.data)
        .then(user => (this.user = user))
        .catch(err => alert(err.message))
    },
    saveUser(goBackToList) {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) {
          alert('не заполнено одно из полей')
          return
        }
        if (this.isNew) {
          axios
            .post(config.serverApi + '/users', this.user)
            .then(() => {
              if (goBackToList) {
                setTimeout(() => this.$router.push({ path: '/users' }), 200)
              }
            })
            .catch(err => alert(err.message))
        } else {
          // редактирование существующего пользователя
          axios
            .put(config.serverApi + '/users/' + this.idUser, this.user)
            .then(() => {
              if (goBackToList) {
                setTimeout(() => this.$router.push({ path: '/users' }), 200) // 180 иногда глючила
              }
            })
            .catch(err => alert(err.message))
        }
      })
    },
    delUser() {
      axios
        .delete(config.serverApi + '/users/' + this.idUser)
        .then(() => this.$router.push({ path: '/users' }))
        .catch(err => alert(err.message))
    },
    setAvatar() {
      // по кнопке вызываем клик на диалоге запроса файла
      this.$refs.sadDialog.click()
    },
    delAvatarButton() {
      this.delAvatarApi(this.user['avatar'])
      this.user['avatar'] = ''
    },
    delAvatarApi(filenameAvatar) {
      axios
        .delete(config.serverApi + '/picture' + filenameAvatar)
        .then(() => this.saveUser(false))
        .catch(err => alert(err.message))
    },
    fileChoiced() {
      // после завершения диалога у нас файл выбран
      // this.$refs.sadDialog.files[0]
      // this.$refs.sadDialog.value - имя файл

      const fileNameChoiced = this.$refs.sadDialog.value
      const extname = fileNameChoiced.substring(fileNameChoiced.lastIndexOf('.') + 1)
      const fileNameCreating = `${config.pictureDir}/${this.idUser}-${Date.now()}.${extname}`
      axios
        .post(config.serverApi + '/picture' + fileNameCreating, this.$refs.sadDialog.files[0])
        .then(response => {
          let prevAvatar = null
          if (this.hasAvatar) {
            prevAvatar = this.user['avatar']
          }
          // в юзере путь в аватаре хранится без точки
          this.user['avatar'] = response.data.link
          this.$refs.sadDialog.value = ''

          if (prevAvatar) {
            this.delAvatarApi(prevAvatar)
          } else {
            this.saveUser(false)
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
