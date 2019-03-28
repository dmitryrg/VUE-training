<template>
  <div id="app">
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <a class="navbar-brand" href="#">Fixed navbar</a>
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
          <router-view to="/" tag="li" class="nav-item" exact>
            <a class="nav-link">Home</a>
          </router-view>
          <router-view to="/about" tag="li" class="nav-item">
            <a class="nav-link">About</a>
          </router-view>
          <router-view to="/users" tag="li" class="nav-item">
            <a class="nav-link">Users</a>
          </router-view>
          <router-view to="/phones" tag="li" class="nav-item">
            <a class="nav-link">Phones</a>
          </router-view>
        </ul>
      </div>
    </nav>

    <main role="main" class="container">
      <router-view />
    </main>
  </div>
</template>

<style>
#app {
  margin-top: 60px;
}
</style>
