<template>
  <div  v-show="isVisible">
    <h4>
      <!--Количество пользователей {{amountUsersMethods()}}-->
      Количество пользователей {{amountUsersComputed}}
    </h4>
    <tag-users-1 :users2="users1">

    </tag-users-1>
  </div>

  <!--<button type="button" @click="triggerShowHide" v-tooltip.right="tooltip">change visible</button>-->
</template>

<script>
    import Users2 from '@/components/Users2.vue'
    export default {
      name: "Users1",
      components: {
        'tag-users-1': Users2
      },
      data: function () {
        return {
          users1: [],
          isVisible: true,
          tooltip: 'всплывающая подсказка'
        }
      },
      methods: {
        triggerShowHide () {
          this.isVisible = !this.isVisible
        },
        /*                    amountUsersMethods () {
                                return this.users ? this.users.length : 0
                            }*/
      },
      computed: {
        amountUsersComputed () {
          return this.users1 ? this.users1.length : 0
        }
      },
      mounted() {
        this.users1 = users0; // users0 - исходный список пользователей
        console.log('load users ->'); // debug
      }
    }
</script>

<style scoped>

</style>
