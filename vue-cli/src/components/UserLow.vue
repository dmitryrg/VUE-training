<template lang="pug">
  div(v-show="isCardReady")
    div.form-group
      label Имя
      input(
        v-validate="'required|alpha|min:2'" 
        type="text"
        :value="userLow.firstName"
        name="firstName"
        :class="{ 'is-invalid': errors.has('firstName'), 'form-control': true }"
        @input="userLow.firstName = $event.target.value"
      )
      span.invalid-feedback(v-show="errors.has('firstName')") {{errors.first('firstName')}}
    div.form-group
      label Фамилия
      input(
        v-model="userLow.lastName"
        v-validate="'required|alpha|min:2'" 
        type="text"
        name="lastName"
        :class="{ 'is-invalid': errors.has('lastName'), 'form-control': true }")
      span.invalid-feedback(v-show="errors.has('lastName')") {{errors.first('lastName')}}
    div.form-group
      label Аватар
      .contain-float
        img(:src="makeUrlImage(userLow.avatar)")
        slot(name="button-avatar")
    div.form-group
      label Статус
      input.form-control(v-model='userLow.isActive' type='checkbox')
    div.form-group
      label Баланс
      input(
        v-model="userLow.balance"
        v-validate="'required|decimal:2'"
        type="text"
        name="balance"
        :class="{ 'is-invalid': errors.has('balance'), 'form-control': true }")
      span.invalid-feedback(v-show="errors.has('balance')") {{errors.first('balance')}}
    div.form-group
      label Возраст
      input(
        v-model="userLow.age"
        v-validate="'numeric|max_value:120'"
        type="text"
        name="age"
        :class="{ 'is-invalid': errors.has('age'), 'form-control': true }")
      span.invalid-feedback(v-show="errors.has('age')") {{ errors.first('age') }}
    div.form-group
      label Компания
      input.form-control(v-model="userLow.company" type="text")
    div.form-group
      label Эл. почта
      input(
        v-model="userLow.email"
        v-validate="'email'"
        type="text"
        name="email"
        :class="{ 'is-invalid': errors.has('email'), 'form-control': true }")
      span.invalid-feedback(v-show="errors.has('email')") {{ errors.first('email') }}
    div.form-group
      label Телефон
      input(
        v-model="userLow.phone" 
        v-validate="'{required: true, regex:/^(8|\+7)\d{10}$/}'"
        type="text" 
        name="phone" 
        :class="{ 'is-invalid': errors.has('phone'), 'form-control': true }")
      span.invalid-feedback(v-show="errors.has('phone')") {{ errors.first('phone') }}
    div.form-group
      label  Адрес
      input.form-control(v-model="userLow.address" type="text")
    div.form-group
      label Интересы
      input.form-control(v-model="userLow.about" type="text")
    div.form-group
      label Дата рождения
      datepicker(
        ref="Date birthday" 
        v-model="userLow.birthday" 
        v-validate="'date_format:dd.MM.yyyy|before:Date registered'" 
        :idRef="'dateBirthday'"
        type="text" 
        name="birthday" 
        :class="{ 'is-invalid': errors.has('birthday'), 'form-control': true }"
      )
      span.invalid-feedback(v-show="errors.has('birthday')") {{errors.first('birthday')}}
    div.form-group
      label Дата регистрации
      datepicker(
        ref="Date registered" 
        v-model="userLow.registered" 
        v-validate="'date_format:dd.MM.yyyy|after:Date birthday'" 
        :idRef="'dateRegistered'"
        type="text" 
        name="registered" 
        :class="{ 'is-invalid': errors.has('registered'), 'form-control': true }")
      span.invalid-feedback(v-show="errors.has('registered')") {{errors.first('registered')}}
</template>

<script>
import { copyObj, equalObj } from '@/functions/deep.js'
import { makeUrlImage } from '@/functions/paths.js'
import Datepicker from '@/components/datepicker.vue'
import { userEmpty } from '@/functions/data.js'

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
    userLow: userEmpty // local user
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
      this.$emit('update-user-top', this.userLow) // генерим свое событие update-userTop и прокидываем туда  userLow
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
