<template>
  <section class="vh-100 d-flex justify-content-center align-items-center">
    <div class="container d-flex rounded-5 login-register-container">
      <div class="row justify-content-center align-items-center">
        <div ref="leftDiv" class="col-md-4 left d-flex">
          <h1 class="title">{{ formTitle }}</h1>
          <p v-if="!register">
            Welcome back! By logging in, you acknowledge that you're ready to deal with our 
            pun-ishingly addictive card game. Prepare to Ronda-vu with some incredible hands!
          </p>
          <p v-if="register">
            Ready to join the Ronda revolution? By registering, you're entering a world 
            where cards rule and puns reign supreme. Get ready to shuffle up and deal some serious fun!
          </p>
          <div
            class="d-flex flex-column flex-md-row justify-content-around mt-auto w-100"
          >
            <div class="image-container">
              <img
                class=""
                src="../assets/img/login/login-banner.png"
                alt="Description"
              />
            </div>
          </div>
        </div>

        <div ref="rightDiv" class="col-md-8 right d-flex">
          <div class="justify-content-center d-flex align-items-center w-100">
            <form class="mt-3 mb-3 w-100">
              <div class="mb-3">
                <label for="inputEmail" class="form-label">Email</label>
                <input
                  id="inputEmail"
                  type="text"
                  class="form-control"
                  placeholder="your-email@example.com"
                  v-model="email"
                />
              </div>
              <div class="mb-3" v-if="register">
                <label for="inputFirstName" class="form-label"
                  >First Name</label
                >
                <input
                  id="inputFirstName"
                  type="text"
                  class="form-control"
                  placeholder="John"
                  v-model="firstName"
                />
              </div>
              <div class="mb-3" v-if="register">
                <label for="inputLastName" class="form-label">Last Name</label>
                <input
                  id="inputLastName"
                  type="text"
                  class="form-control"
                  placeholder="Doe"
                  v-model="lastName"
                />
              </div>
              <div class="mb-3">
                <label for="inputPassword" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="inputPassword"
                  placeholder="Password"
                  v-model="password"
                />
              </div>
              <div class="mb-3" v-if="register">
                <label for="inputConfirmPassword" class="form-label"
                  >Confirm Password</label
                >
                <input
                  type="password"
                  class="form-control"
                  id="inputConfirmPassword"
                  placeholder="Confirm Password"
                  v-model="confirmPassword"
                />
              </div>
              <div class="mb-3" v-if="register">
                <label for="inputDateOfBirth" class="form-label"
                  >Date of Birth (Must be over 18!)</label
                >
                <input
                  type="date"
                  class="form-control"
                  id="inputDateOfBirth"
                  v-model="dateOfBirth"
                />
              </div>
              <div class="text-center">
                <div class="text-danger" v-if="errorMessage">
                  {{ errorMessage }}
                </div>
                <button
                  type="button"
                  class="btn btn-primary btn-wide mt-2"
                  @click="submitForm"
                >
                  {{ submitButtonText }}
                </button>
              </div>
              <div class="text-center">
                <button
                  type="button"
                  class="btn btn-secondary btn-wide mt-2"
                  @click="toggleForm"
                >
                  {{ toggleButtonText }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal"
      :style="{
        display: showSuccessModal ? 'flex !important' : 'none !important',
      }"
      tabindex="-1"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Registration Successful</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <p>{{ modalMessage }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useUserAuthStore } from "@/stores/authstore";
import { gsap } from "gsap";
import { vShow } from "vue";

export default {
  name: "Login",
  data() {
    return {
      store: useUserAuthStore(),
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      errorMessage: "",
      register: false,
      showSuccessModal: false,
      modalMessage: "",
    };
  },
  computed: {
    formTitle() {
      return this.register ? "Register" : "Login";
    },
    submitButtonText() {
      return this.register ? "Continue" : "Submit";
    },
    toggleButtonText() {
      return this.register
        ? "Already have an account? Log in!"
        : "Don't have an account? Register!";
    },
  },
  mounted() {
    this.register = this.$route.path === '/register';
  },
  methods: {
    submitForm() {
      if (this.register) {
        this.registerUser();
      } else {
        this.login();
      }
    },
    toggleForm() {
      this.register = !this.register;
      this.errorMessage = "";
      this.animateSwitch();
    },
    animateSwitch() {
      let leftDivPosition = this.$refs.leftDiv.getBoundingClientRect();
      let rightDivPosition = this.$refs.rightDiv.getBoundingClientRect();
      let childElements = this.$refs.rightDiv.querySelectorAll(".mb-3");
      gsap.to(childElements, {
        opacity: 0,
        duration: 0.2,
        onComplete: (fadeIn) => {
          gsap.to(childElements, {
            opacity: 1,
            duration: 0.7,
          });
        },
      });
      if (this.register) {
        this.animateRegister(leftDivPosition, rightDivPosition);
      } else {
        this.animateLogin(leftDivPosition, rightDivPosition);
      }
    },
    animateRegister(leftDivPosition, rightDivPosition) {
      gsap.to(this.$refs.leftDiv, {
        x: rightDivPosition.x - leftDivPosition.x + leftDivPosition.width,
        duration: 1,
      });

      gsap.to(this.$refs.rightDiv, {
        x: leftDivPosition.x - rightDivPosition.x,
        height: "71vh",
        borderRadius: "20px 0 0 20px",
        duration: 1,
      });
    },
    animateLogin(leftDivPosition, rightDivPosition) {
      gsap.to(this.$refs.leftDiv, {
        x: 0,
        duration: 1,
      });

      gsap.to(this.$refs.rightDiv, {
        x: 0,
        height: "55vh",
        borderRadius: "0px 20px 20px 0px",
        duration: 1,
      });
    },
    login() {
      this.store
        .login(this.email, this.password)
        .then(() => {
          this.$router.replace("/dashboard");
        })
        .catch((error) => {
          this.errorMessage =
            error.response.data.message;
        });
    },
    registerUser() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match!";
        return;
      }
      this.store
        .register(
          this.email,
          this.password,
          this.firstName,
          this.lastName,
          this.dateOfBirth
        )
        .then((res) => {
          this.modalMessage = res;
          this.showSuccessModal = true;
        })
        .catch((error) => {
          this.errorMessage = error;
        });
    },
    closeModal() {
      this.showSuccessModal = false;
      this.password = "";
      this.firstName = "";
      this.lastName = "";
      this.confirmPassword = "";
      this.dateOfBirth = "";
      this.toggleForm();
    },
  },
};
</script>

<style scoped>

.btn-wide {
  width: 200px;
  margin: 0 auto;
}

.login-register-container {
  margin-top: 50px;
  min-height: 55vh !important;
  width: 45vw !important;
}

.left {
  height: 90%;
  background: white;
  overflow: hidden;
  flex-direction: column;
}

.right {
  height: 100%;
  background: #5f90ac 100%;
  box-shadow: 0px 0px 40px 20px rgba(0, 0, 0, 0.23);
  border-bottom-right-radius: 20px;
  border-top-right-radius: 20px;
}

label {
  font-size: 20px;
  height: 16px;
  margin-top: 5px;
  margin-bottom: 10px;
}

.modal {
  justify-content: center;
  align-items: center;
}

.btn {
  margin-bottom: 10px;
}

.title {
  margin: 50px 35px 5px;
}

.modal-dialog {
  min-width: 400px;
}

.modal-content {
  border-radius: 0;
}

.modal-header {
  background-color: #f8f9fa;
  border-bottom: none;
}

.modal-title {
  margin: 0;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  border-top: none;
}

.left p {
  color: #999;
  font-size: 14px;
  line-height: 1.5;
  margin: 35px;
  margin-top: 10px;
}

.image-container img {
  width: 100%;
  border-radius: 1.25rem;
}
</style>
