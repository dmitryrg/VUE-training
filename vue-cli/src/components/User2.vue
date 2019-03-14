<template>
  <div v-show="isCardReady2">
    <div class="form-group">
      <label>Имя</label>
      <input
        :value="localUser2.firstName"
        type="text"
        class="form-control"
        @input="localUser2.firstName = $event.target.value"
      />
    </div>
    <div class="form-group">
      <label>Фамилия</label>
      <input v-model="localUser2.lastName" type="text" class="form-control" />
    </div>
    <div class="form-group">
      <label>Отчество</label>
      <input v-model="localUser2.patronymic" type="text" class="form-control" />
    </div>
    <div class="form-group">
      <label>Аватар</label>
      <img :src="fillVal(localUser2.avatar)" />
    </div>
  </div>
</template>

<script>
// import equalObj from '@/functions/deep.js'

import { copyObj, equalObj } from '@/functions/deep.js'

const DEFAULT_IMAGE = './avatars/default.png'

export default {
  name: 'User2',
  props: {
    user2: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    localUser2: {}
  }),
  computed: {
    isCardReady2() {
      return !!this.user2.firstName
    }
  },
  watch: {
    user2: {
      deep: true,
      handler: 'updateUser2Down'
    },
    localUser2: {
      deep: true,
      handler: 'updateUser2Up'
    }
  },
  methods: {
    fillVal(val) {
      return val ? val : DEFAULT_IMAGE
    },
    updateUser2Up() {
      this.$emit('update-user', copyObj(this.localUser2)) // генерим свое событие update-user и закидываем туда  localUser2
    },
    updateUser2Down() {
      if (!equalObj(this.user2, this.localUser2)) this.localUser2 = copyObj(this.user2)
    }
  }
}
</script>

<style scoped>
img {
  width: 100px;
}
</style>
