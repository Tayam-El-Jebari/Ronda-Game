import { defineStore } from 'pinia'
import axios from '../axios-auth';
import jwtDecode from 'jwt-decode';


export const useUserAuthStore = defineStore('auth', {
    state: () => ({
        jwt: localStorage.getItem('jwt') || '',
    }),
    getters: {
        isAuthenticated: (state) => state.jwt !== '',
        getJwt: (state) => state.jwt,
        getUserId: (state) => state.userId,
        isJwtExpired: (state) => {
            try {
                const payload = jwtDecode(state.jwt);
                return payload && payload.exp ? payload.exp < Math.floor(Date.now() / 1000) : true;
            } catch (error) {
                return true;
            }
        },
        getUsername: (state) => {
            if (state.jwt) {
                const decodedJwt = jwtDecode(state.jwt);
                return decodedJwt.data && decodedJwt.data.username ? decodedJwt.data.username : '';
            }
            return '';
        },
        getuserId: (state) => {
            if (state.jwt) {
                const decodedJwt = jwtDecode(state.jwt);
                return decodedJwt.data && decodedJwt.data.id ? decodedJwt.data.id : '';
            }
            return '';
        },
        getRole: (state) => {
            if (state.jwt) {
                const decodedJwt = jwtDecode(state.jwt);
                return decodedJwt.data && decodedJwt.data.role ? decodedJwt.data.role : '';
            }
            return '';
        },
    },
    actions: {
        login(email, password) {
            return new Promise((resolve, reject) => {
                axios.post("/users/login", {
                    email: email,
                    password: password,
                })
                    .then((res) => {
                        const decodedJwt = jwtDecode(res.data.jwt);
                        this.jwt = res.data.jwt;
                        axios.defaults.headers.common['Authorization'] = "Bearer " + res.data.jwt;
                        localStorage.setItem('jwt', res.data.jwt);
                        resolve()
                    })
                    .catch((error) => reject(error));
            })
        },
        register(username, email, password, firstName, lastName, dateOfBirth) {
            return new Promise((resolve, reject) => {
                axios.post("/users/register", {
                    username: username,
                    email: email,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                    dateOfBirth: dateOfBirth,
                })
                    .then((res) => {
                        resolve(res.data)
                    })
                    .catch((error) => reject(error));
            });
        },
        logout() {
            this.jwt = '';
            this.userId = '';
            this.role = '';
            if (localStorage.getItem('jwt') === null) return;
            localStorage.removeItem('jwt');
        },
    },
});