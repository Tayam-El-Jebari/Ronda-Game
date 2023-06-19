<template>
    <div class="container d-flex flex-column justify-content-center align-items-center text-center vh-100">
      <div>
        <i class="fas fa-exclamation-triangle fa-5x text-warning mb-4"></i>
      <h1 class="display-4">Whoops! You're out of cards!</h1>
      <p class="lead">You don't have the right cards to view this page.</p>
      <p>Maybe you need to shuffle your deck?</p>
      <router-link to="/" class="btn btn-primary mt-3">
        <i class="fas fa-home"></i> Back to Home
      </router-link>
    </div>
  </div>
</template>

  
  <script>
  import '@fortawesome/fontawesome-free/css/all.css';

  export default {
    name: "Forbidden403"
  };
  </script>
  
  <style scoped>
  .container {
    font-family: 'Arial', sans-serif;
  }
  </style>