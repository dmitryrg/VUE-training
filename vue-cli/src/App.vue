<template>
  <div id="app">
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <router-link class="navbar-brand" to="/">
        {{ title }}
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarCollapse"
        aria-controls="navbarCollapse"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="navbarCollapse" class="collapse navbar-collapse">
        <ul class="navbar-nav mr-auto">
          <!--<router-link to="/" tag="li" class="nav-item" exact active-class="active">-->
          <router-link to="/" tag="li" class="nav-item" exact>
            <a class="nav-link">Home</a>
          </router-link>
          <router-link to="/about" tag="li" class="nav-item">
            <a class="nav-link">About</a>
          </router-link>
          <router-link to="/users" tag="li" class="nav-item">
            <a class="nav-link">Users</a>
          </router-link>
          <router-link to="/phones" tag="li" class="nav-item">
            <a class="nav-link">Phones</a>
          </router-link>
        </ul>
      </div>
    </nav>

    <main role="main" class="container">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    title() {
      // return 'aaa'
      return this.$store.state.navbarTitle
    }
  }
}
</script>

<style>
#app {
  margin-top: 60px;
}
</style>
