import { defineStore } from 'pinia'
import axios from '../axios-auth'
export const useUserAuthStore = defineStore('auth', {
    state: () => ({
        jwt: '',
        username: '',

    }),
    getters: {
        isAuthenticated: (state) => state.jwt !== ''
    },
    actions: {
        autologin(){
            if(localStorage["jwt"] && localStorage["username"]){
                this.jwt = localStorage["jwt"]
                this.username = localStorage["username"]
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.jwt;
            }
        },
        login(username, password) {
            return new Promise((resolve, reject) => {
                axios
                    .post("users/login", {
                        username: username,
                        password: password,

                    })
                    .then((result) => {
                        console.log(result);
                        this.jwt = result.data.jwt;
                        this.username = result.data.username;
                        localStorage.setItem("jwt", this.jwt);
                        localStorage.setItem("username",  this.username);
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + result.data.jwt;
                        resolve();

                    })
                    .catch((error) => {
                        reject
                    });
            });   

            // async login(username, password) {
            //     return new Promise((resolve, reject) => {
            //        return new Promise(async (resolve, reject) => {
            //            try {
            //              const result = await axios.post("users/login", { username: username, password: password });
            //              console.log(result);
            //              this.jwt = result.data.jwt;
            //              this.username = result.data.username;
            //              axios.defaults.headers.common['Authorization'] = 'Bearer ' + result.data.jwt;
            //              resolve();
            //            } catch (error) {
            //                reject("There was an error logging in. Please check your credentials and try again.")
            //            }
    }
}});