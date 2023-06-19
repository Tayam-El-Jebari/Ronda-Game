<template>
    <div class="container d-flex flex-column justify-content-center align-items-center text-center vh-100">
      <div>
        <i class="fas fa-map-signs fa-5x text-warning mb-4"></i>
        <h1 class="display-4">Oops! We're in a card jam.</h1>
        <p class="lead">We can't find the card you're looking for.</p>
        <p>It seems you've shuffled off the right track.</p>
        <router-link to="/" class="btn btn-primary mt-3">
          <i class="fas fa-home"></i> Back to Home
        </router-link>
      </div>
    </div>
  </template>
<script>
import '@fortawesome/fontawesome-free/css/all.css';

export default {
    name: "NotFound404"
};
</script>
  
<style scoped>
.container {
    font-family: 'Arial', sans-serif;
}
</style>