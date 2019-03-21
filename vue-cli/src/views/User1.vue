<template>
  <div>
    <tag-user-1 :user2="user1" :is-card-ready2="isCardReady1" @update-user="updateUser1">
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
            @click="delAvatar"
          >
            del
          </button>
        </div>
      </template>
    </tag-user-1>

    <button type="button" class="btn btn-primary" @click="goBack">Back</button>
    <button type="button" class="btn btn-success" @click="save">Save</button>
    <button v-show="!isNew" type="button" class="btn btn-danger" @click="del">Del</button>

    <input v-show="false" ref="sadDialog" type="file" @change="fileChoiced" />

    <!--    <pre>
      {{ user1 }}
    </pre>-->
  </div>
</template>

<script>
import axios from 'axios'
import User2 from '@/components/User2.vue'

// const xhr = new XMLHttpRequest()

const API_SERVER = 'http://localhost:3001'
// const API_SERVER = 'https://api.limestudio.ru/apiservervue'
const PICTURE_DIR = '/avatars'

export default {
  name: 'User1',
  components: {
    'tag-user-1': User2
  },
  data: () => {
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
    },
    hasAvatar() {
      return !!this.user1['avatar']
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
    save(event) {
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
          .then(() => {
            // если запущена по клику, то прилетит событие
            if (event) this.$router.push({ path: '/users' })
          })
          .catch(err => alert(err.message))
      } else {
        // редактирование существующего пользователя
        axios
          .put(API_SERVER + '/users/' + this.idUser, this.user1)
          .then(() => {
            if (event) this.$router.push({ path: '/users' })
          })
          .catch(err => alert(err.message))
      }
    },
    del() {
      axios
        .delete(API_SERVER + '/users/' + this.idUser)
        .then(() => this.$router.push({ path: '/users' }))
        .catch(err => alert(err.message))
    },
    addAvatar() {
      // по кнопке вызываем клик на диалоге запроса файла
      this.$refs.sadDialog.click()
    },
    delAvatar() {
      this.delAvatarApi(this.user1['avatar'])
      this.user1['avatar'] = ''
    },
    delAvatarApi(filenameAvatar) {
      axios
        .delete(API_SERVER + '/picture' + filenameAvatar)
        .then(() => this.save(null))
        .catch(err => alert(err.message))
    },
    fileChoiced() {
      // после завершения диалога у нас файл выбран
      // this.$refs.sadDialog.files[0]
      // this.$refs.sadDialog.value - имя файл
      // const fileSend = new FormData()

      // fileSend.append('image', this.$refs.sadDialog.files[0])

      /*
      xhr.open('POST', API_SERVER + '/picture/' + this.idUser)
      xhr.setRequestHeader('Content-type', 'image/jpg')
      xhr.send(this.$refs.sadDialog.files[0])
      xhr.onload = () => {
        this.user1['avatar'] = '.' + JSON.parse(xhr.responseText).link
        console.log(' post xhr.responseText ->', this.user1['avatar']) // debug
        this.$refs.sadDialog.value = ''
      }
*/
      const fileNameChoiced = this.$refs.sadDialog.value
      const extname = fileNameChoiced.substring(fileNameChoiced.lastIndexOf('.') + 1)
      const fileNameCreating = `${PICTURE_DIR}/${this.idUser}-${Date.now()}.${extname}`
      console.log('fileNameCreating ->', fileNameCreating) // debug
      axios
        .post(API_SERVER + '/picture' + fileNameCreating, this.$refs.sadDialog.files[0])
        .then(response => {
          let prevAvatar = null
          if (this.hasAvatar) prevAvatar = this.user1['avatar']
          // в юзере путь в аватаре хранится без точки
          this.user1['avatar'] = response.data.link
          this.$refs.sadDialog.value = ''

          if (prevAvatar) {
            this.delAvatarApi(prevAvatar)
          } else {
            this.save(null)
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
