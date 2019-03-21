<template>
  <div v-show="isCardReady2">
    <div class="form-group">
      <label>Имя</label>
      <input
        type="text"
        class="form-control"
        :value="localUser2.firstName"
        @input="localUser2.firstName = $event.target.value"
      />
    </div>
    <div class="form-group">
      <label>Фамилия</label>
      <input v-model="localUser2.lastName" type="text" class="form-control" />
    </div>
    <div class="form-group">
      <label>Аватар</label>
      <div class="contain-float">
        <img :src="fillVal(localUser2.avatar)" />
        <slot name="my-slot-name"></slot>
      </div>
    </div>
    <div class="form-group">
      <label>Статус</label>
      <input v-model="localUser2.isActive" type="checkbox" class="form-control" />
    </div>
    <div class="form-group">
      <label>Баланс</label>
      <input v-model="localUser2.balance" type="text" class="form-control" />
    </div>
    <div class="form-group">
      <label>Возраст</label>
      <input v-model="localUser2.age" type="text" class="form-control" />
    </div>
    <div class="form-group">
      <label>Компания</label>
      <input v-model="localUser2.company" type="text" class="form-control" />
    </div>
    <div class="form-group">
      <label>Эл. почта</label>
      <input v-model="localUser2.email" type="text" class="form-control" />
    </div>
    <div class="form-group">
      <label>Телефон</label>
      <input v-model="localUser2.phone" type="text" class="form-control" />
    </div>
    <div class="form-group">
      <label>Адрес</label>
      <input v-model="localUser2.address" type="text" class="form-control" />
    </div>
    <div class="form-group">
      <label>Интересы</label>
      <input v-model="localUser2.about" type="text" class="form-control" />
    </div>
    <div class="form-group">
      <label>Дата регистрации</label>
      <input v-model="localUser2.registered" type="text" class="form-control" />
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
    },
    isCardReady2: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    localUser2: {}
  }),
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
      // точка ставится уже либо в шаблоне
      return val ? `.${val}` : DEFAULT_IMAGE
    },
    updateUser2Up() {
      this.$emit('update-user', copyObj(this.localUser2)) // генерим свое событие update-user и закидываем туда  localUser2
      console.log('this.localUser2 Up ->', this.localUser2) // debug
    },
    updateUser2Down() {
      if (!equalObj(this.user2, this.localUser2)) this.localUser2 = copyObj(this.user2)
      console.log('this.localUser2 Down ->', this.localUser2) // debug
    }
  }
}
</script>

<style scoped>
img {
  width: 100px;
  margin: 20px;
  float: left;
}
.contain-float:after {
  content: '.';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
</style>
