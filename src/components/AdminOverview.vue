<template>
  <section class="d-flex justify-content center align-items-center mt-auto vh-100">
    <div class="container d-flex justify-content-center align-items-center rounded-5 admin-overview-container">
      <div class="row justify-content-center align-items-center">
        <div class="col-md-12 d-flex justify-content-around align-items-center icon-row">
          <div class="icon-container" @click="navigateToUsers">
            <p class="icon-text text-white">View All Users</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
  
<script>
export default {
  name: "AdminOverview",
  methods: {
    navigateToUsers() {
      this.$router.replace("/admin-overview/users");
    },
  },
};
</script>
  
<style scoped>
.container {
  margin-top: 50px;
}

.admin-overview-container {
  background: #5b6b7a 100%;
  box-shadow: 0px 0px 40px 20px rgba(0, 0, 0, 0.23);
  border-radius: 20px;
}

.icon-row {
  flex-direction: row;
}

.icon-container {
  cursor: pointer;
  margin: 20px;
  text-align: center;
}

.icon-text {
  margin-top: 10px;
}
</style>