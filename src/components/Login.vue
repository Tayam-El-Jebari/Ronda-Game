<template>
  <section>
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <form>
            <div class="alert alert-danger" v-if='errormessage' role="alert">
              {{errormessage}}
            </div>
            <div class="mb-3">
              <label for="inputUsername" class="form-label">Username</label>
              <input id="inputUsername" type="text" class="form-control" v-model="username" />
            </div>
            <div class="mb-3">
              <label for="inputPassword" class="form-label">Password</label>
              <input type="password" class="form-control" id="inputPassword" v-model="password" />
            </div>
            <button type="button" class="btn btn-primary" @click="login">

              Submit</button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from '../axios-auth.js'
import { useUserAuthStore } from '../stores/authstore'

export default {
  setup(){
    return {store: useUserAuthStore()}
  },

  name: "Login",
  data() {
    return {
      "username": "username",
      "password": "password",
      errormessage: ""
    };
  },
  methods: {
    async login() {
      // this.store.login(this.username, this.password).then(()=>{
      //   this.$router.push('/products');  
      // })
      // .catch(res => {this.errormessage = res});
        try{
          await this.store.login(this.username, this.password);
          this.$router.push('/products');
        }catch(error) {
          this.errormessage = error
        }
      
      // axios
      //   .post("users/login", {
      //     username: this.username,
      //     password: this.password,
          
      //   })
      //   .then((result) => {
      //     console.log(result);
      //     axios.defaults.headers.common['Authorization'] = 'Bearer ' + result.data.jwt;
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //     this.errormessage = "There was an error logging in. Please check your credentials and try again.";
      //   });
    },
  },
};
</script>

<style></style>