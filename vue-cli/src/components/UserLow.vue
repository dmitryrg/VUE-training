<template>
  <div v-show="isCardReady">
    <div class="form-group">
      <label>Имя</label>
      <input
        v-validate="'required|alpha|min:2'"
        type="text"
        :value="userLow.firstName"
        name="firstName"
        :class="{ 'is-invalid': errors.has('firstName'), 'form-control': true }"
        @input="userLow.firstName = $event.target.value"
      />
      <span v-show="errors.has('firstName')" class="invalid-feedback">{{
        errors.first('firstName')
      }}</span>
    </div>
    <div class="form-group">
      <label>Фамилия</label>
      <input
        v-model="userLow.lastName"
        v-validate="'required|alpha|min:2'"
        type="text"
        name="lastName"
        :class="{ 'is-invalid': errors.has('lastName'), 'form-control': true }"
      />
      <span v-show="errors.has('lastName')" class="invalid-feedback">{{
        errors.first('lastName')
      }}</span>
    </div>
    <div class="form-group">
      <label>Аватар</label>
      <div class="contain-float">
        <img :src="makeUrlImage(userLow.avatar)" />
        <slot name="button-avatar"></slot>
      </div>
    </div>
    <div class="form-group">
      <label>Статус</label>
      <input v-model="userLow.isActive" type="checkbox" class="form-control" />
    </div>
    <div class="form-group">
      <label>Баланс</label>
      <input
        v-model="userLow.balance"
        v-validate="'required|decimal:2'"
        type="text"
        name="balance"
        :class="{ 'is-invalid': errors.has('balance'), 'form-control': true }"
      />
      <span v-show="errors.has('balance')" class="invalid-feedback">{{
        errors.first('balance')
      }}</span>
    </div>
    <div class="form-group">
      <label>Возраст</label>
      <input
        v-model="userLow.age"
        v-validate="'numeric|max_value:120'"
        type="text"
        name="age"
        :class="{ 'is-invalid': errors.has('age'), 'form-control': true }"
      />
      <span v-show="errors.has('age')" class="invalid-feedback">{{ errors.first('age') }}</span>
    </div>
    <div class="form-group">
      <label>Компания</label>
      <input v-model="userLow.company" type="text" class="form-control" />
    </div>
    <div class="form-group">
      <label>Эл. почта</label>
      <input
        v-model="userLow.email"
        v-validate="'email'"
        type="text"
        name="email"
        :class="{ 'is-invalid': errors.has('email'), 'form-control': true }"
      />
      <span v-show="errors.has('email')" class="invalid-feedback">{{ errors.first('email') }}</span>
    </div>
    <div class="form-group">
      <label>Телефон</label>

      <input
        v-model="userLow.phone"
        v-validate="{
          required: true,
          regex: /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/
        }"
        type="text"
        name="phone"
        :class="{ 'is-invalid': errors.has('phone'), 'form-control': true }"
      />
      <span v-show="errors.has('phone')" class="invalid-feedback">{{ errors.first('phone') }}</span>
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
      <label>Дата рождения</label>
      <!--<input v-model="userLow.registered" type="text" class="form-control" />-->
      <datepicker
        ref="Date birthday"
        v-model="userLow.birthday"
        v-validate="'date_format:dd.MM.yyyy|before:Date registered'"
        :idRef="'dateBirthday'"
        type="text"
        name="birthday"
        :class="{ 'is-invalid': errors.has('birthday'), 'form-control': true }"
      >
      </datepicker>
      <span v-show="errors.has('birthday')" class="invalid-feedback">{{
        errors.first('birthday')
      }}</span>
    </div>
    <div class="form-group">
      <label>Дата регистрации</label>
      <!--<input v-model="userLow.registered" type="text" class="form-control" />-->
      <datepicker
        ref="Date registered"
        v-model="userLow.registered"
        v-validate="'date_format:dd.MM.yyyy|after:Date birthday'"
        :idRef="'dateRegistered'"
        type="text"
        name="registered"
        :class="{ 'is-invalid': errors.has('registered'), 'form-control': true }"
      ></datepicker>
      <span v-show="errors.has('registered')" class="invalid-feedback">{{
        errors.first('registered')
      }}</span>
    </div>
  </div>
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
