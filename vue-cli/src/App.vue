<template lang="pug">
  #app
    nav.navbar.navbar-expand-md.navbar-dark.fixed-top.bg-dark
      router-link.navbar-brand(to="/") {{ title }}
      button.navbar-toggler(
        type="button"
        data-toggle="collapse"
        data-target="#navbarCollapse"
        aria-controls="navbarCollapse"
        aria-expanded="false"
        aria-label="Toggle navigation")
        span.navbar-toggler-icon
      #navbarCollapse.collapse.navbar-collapse
        ul.navbar-nav.mr-auto
          router-link.nav-item(to="/" tag="li" exact='')
            a.nav-link Home
          router-link.nav-item(to="/about" tag="li")
            a.nav-link About
          router-link.nav-item(to="/users" tag="li")
            a.nav-link Users
          router-link.nav-item(to="/phones" tag="li")
            a.nav-link Phones
          li.nav-item
            a.nav-link(:href="urlCeo") CEO
    main.container(role="main")
      router-view
</template>

<script>
import config from '@/config.js'
export default {
  name: 'App',
  computed: {
    title() {
      return this.$store.state.navbarTitle
    },
    urlCeo() {
      return config.serverPug + '/phones.html'
    }
  }
}
</script>

<style>
#app {
  margin-top: 60px;
}
</style>
