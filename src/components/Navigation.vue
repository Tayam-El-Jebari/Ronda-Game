<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark vw-100">
    <div class="container-fluid ml-5">
      <ul class="navbar-nav me-auto mb-2 mb-md-0">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active"
            >Home</router-link
          >
        </li>      
        <li class="nav-item">
          <router-link to="/home?rules" class="nav-link" active-class="active"
            >Rules</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/games" class="nav-link" active-class="active"
            >Games</router-link
          >
        </li>
      </ul>
      <ul class="navbar-nav ml-auto mb-2 mb-md-0">
        <li class="nav-item">
          <router-link to="/login" class="nav-link" active-class="active"
            >Login/Register</router-link
          >
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navigation",
};
</script>

<style scoped>
*{
  font-family: 'instrument Serif';
}
.navbar{
  position: fixed;
  z-index:999;
  background-color: #5b6b7a !important;
  font-size: 1.4rem;
}
.container-fluid{
  margin-left:5vw !important;
  margin-right:1vw;
}
</style>