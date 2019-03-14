<template>
  <div>
    <tag-user-1 :user2="user1"></tag-user-1>
    <button type="button" @click="goBack">Back</button>
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
    }
  },
  mounted() {
    axios
      .get('http://127.0.0.1:3000/api/user/' + this.idUser)
      .then(response => response.data)
      .then(user => (this.user1 = user))
  },
  methods: {
    goBack() {
      this.$router.push({ path: '/users' })
    }
  }
}
</script>

<style scoped></style>
