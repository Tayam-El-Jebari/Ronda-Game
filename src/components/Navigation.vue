<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark vw-100">
    <div class="container-fluid ml-5">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <li class="nav-item">
            <router-link to="/" class="nav-link" active-class="active">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/gameTable" class="nav-link" active-class="active">Play Ronda</router-link>
          </li>
        </ul>
        <ul class="navbar-nav ml-auto mb-2 mb-md-0">
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link to="/login" class="nav-link" active-class="active">Login/Register</router-link>
          </li>
          <li class="nav-item" v-if="isAuthenticated && isUserAdmin">
            <router-link to="/admin-overview" class="nav-link" active-class="active">Admin Overview</router-link>
          </li>
          <li class="nav-item" v-if="isAuthenticated">
            <button class="btn btn-link nav-link" @click="logout">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useUserAuthStore } from "../stores/authstore.js";

export default {
  name: "Navigation",
  computed: {
    isAuthenticated() {
      const store = useUserAuthStore();
      return store.isAuthenticated;
    },
    isUserAdmin() {
      const store = useUserAuthStore();
      console.log(store.getRole);
      return store.getRole == 'admin';
    },
  },
  methods: {
    logout() {
      const store = useUserAuthStore();
      store.logout();
      window.location.reload();
    },
  },
};
</script>

<style scoped>
* {
  font-family: 'instrument Serif';
}

.navbar {
  position: fixed;
  z-index: 999;
  background-color: #5b6b7a !important;
  font-size: 1.4rem !important;
}

.nav-link {
  font-size: 1.4rem;

}

.container-fluid {
  margin-left: 5vw !important;
  margin-right: 1vw;
}
</style>