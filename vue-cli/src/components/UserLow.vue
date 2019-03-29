<template>
  <div v-show="isCardReady">
    <div class="form-group">
      <label>Имя</label>
      <input
        v-validate="'required'"
        :value="userLow.firstName"
        type="text"
        :class="{ 'is-invalid': errors.has('firstName'), 'form-control': true }"
        name="firstName"
        @input="userLow.firstName = $event.target.value"
      />
      <span v-show="errors.has('firstName')" class="invalid-feedback">{{
        errors.first('firstName')
      }}</span>
    </div>
    <div class="form-group">
      <label>Фамилия</label>
      <input v-model="userLow.lastName" type="text" class="form-control" />
    </div>
    <div class="form-group">
      <label>Аватар</label>
      <div class="contain-float">
        <img :src="makeUrlImage(userLow.avatar)" />
        <slot name="my-slot-name"></slot>
      </div>
    </div>
    <div class="form-group">
      <label>Статус</label>
      <input v-model="userLow.isActive" type="checkbox" class="form-control" />
    </div>
    <div class="form-group">
      <label>Баланс</label>
      <input v-model="userLow.balance" type="text" class="form-control" />
    </div>
    <div class="form-group">
      <label>Возраст</label>
      <input v-model="userLow.age" type="text" class="form-control" />
    </div>
    <div class="form-group">
      <label>Компания</label>
      <input v-model="userLow.company" type="text" class="form-control" />
    </div>
    <div class="form-group">
      <label>Эл. почта</label>
      <input v-model="userLow.email" type="text" class="form-control" />
    </div>
    <div class="form-group">
      <label>Телефон</label>
      <input v-model="userLow.phone" type="text" class="form-control" />
    </div>
    <div class="form-group">
      <label>Адрес</label>
      <input v-model="userLow.address" type="text" class="form-control" />
    </div>
    <div class="form-group">
      <label>Интересы</label>
      <input v-model="userLow.about" type="text" class="form-control" />
    </div>
    <div class="form-group">
      <label>Интересы</label>
      <input v-model="userLow.about" type="text" class="form-control" />
    </div>
    <div class="form-group">
      <label>Дата рождения</label>
      <!--<input v-model="userLow.registered" type="text" class="form-control" />-->
      <datepicker v-model="userLow.birthday" :idRef="'dateBirthday'"></datepicker>
    </div>
    <div class="form-group">
      <label>Дата регистрации</label>
      <!--<input v-model="userLow.registered" type="text" class="form-control" />-->
      <datepicker v-model="userLow.registered" :idRef="'dateRegistered'"></datepicker>
    </div>
  </div>
</template>
<!--:date3="userLow.birthday"
@changePicker3="userLow.birthday = $event"-->
<script>
// import equalObj from '@/functions/deep.js'
// import { formatDate } from '@/functions/formatters.js'
import { copyObj, equalObj } from '@/functions/deep.js'
import { makeUrlImage } from '@/functions/paths.js'
import Datepicker from '@/components/datepicker.vue'

export default {
  name: 'UserLow',
  inject: ['$validator'],
  components: {
    datepicker: Datepicker
    // datepicker: () => import('@/components/datepicker')
  },
  props: {
    userTop: {
      type: Object,
      required: true
    },
    isCardReady: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    userLow: {} // local userTop
  }),
  watch: {
    userTop: {
      deep: true,
      handler: 'updateUserLow'
    },
    userLow: {
      deep: true,
      handler: 'updateUserTop'
    }
  },
  methods: {
    makeUrlImage,
    updateUserTop() {
      this.$emit('update-user-top', copyObj(this.userLow)) // генерим свое событие update-userTop и закидываем туда  userLow
      console.log('userTop Up ->', this.userLow) // debug
    },
    updateUserLow() {
      if (!equalObj(this.userTop, this.userLow)) this.userLow = copyObj(this.userTop)
      console.log('userLow Down ->', this.userLow) // debug
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
