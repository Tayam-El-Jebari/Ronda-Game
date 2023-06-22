<template>
    <section class="vh-100">
        <div class="container table ml-5 ">
            <div class="d-flex justify-content-center align-items-center">
                <label for="offset" class="me-2">page: </label>
                <input v-model="offset" id="offset" type="number" class="me-5">

                <label for="limit" class="me-2">Limit: </label>
                <input v-model="limit" id="limit" type="number" class="me-5">

                <label for="username" class="me-2">Username: </label>
                <input v-model="username" id="username" type="text" class="me-5">
            </div>
            <UserTable :users="users" @updateUser="updateUser" @deleteUser="deleteUser" />
        </div>
    </section>
</template>

<script>
import axios from "axios";
import UserTable from "./users/UserTable.vue";
import { useUserAuthStore } from '@/stores/authstore'

export default {
    name: "Users",
    components: {
        UserTable,
    },
    mounted() {
        this.getUsers();
    },
    data() {
        return {
            users: [],
            offset: 0,
            limit: 25,
            username: "",
        };
    },
    methods: {
        getUsers() {
            const authStore = useUserAuthStore();

            axios.get("http://localhost:80/users", {
                headers: {
                    'Authorization': `Bearer ${authStore.getJwt}`
                },
                params: {
                    offset: this.offset,
                    limit: this.limit,
                    username: this.username,
                },
            })
                .then(response => {
                    this.users = response.data;
                }).catch(error => {
                    console.log(error);
                })
        },
        updateUser(user) {
            this.users = this.users.map(u => {
                if (u.id === user.id) {
                    return {
                        ...u,
                        ...user,
                    };
                } else {
                    return u;
                }
            });
        },
        deleteUser(user) {
            this.users = this.users.filter(u => u.id !== user.id);
        },
    },
    watch: {
        offset() {
            this.getUsers();
        },
        limit() {
            this.getUsers();
        },
        username() {
            this.getUsers();
        }
    }
};
</script>
<style scoped>
.table {
    padding-top: 150px;
    min-width: 90vw;
}
</style>