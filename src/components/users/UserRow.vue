<template>
    <tr>
        <td>{{ user.username }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.first_name }}</td>
        <td>{{ user.last_name }}</td>
        <td>{{ user.role }}</td>
        <td>{{ user.date_of_birth }}</td>
        <td>{{ user.winsAgainstCPU }}</td>
        <td>{{ user.lossesAgainstCPU }}</td>
        <td>{{ user.tiesAgainstCPU }}</td>

        <td>
            <button @click="showUpdateModal = true" class="btn update btn-warning">Update</button>
            <button @click="showDeactivateModal = true" class="btn btn-danger">delete</button>
        </td>
        <UpdateUserModal :show="showUpdateModal" :user="user" @updateUser="updateUserDetails"
            @close="showUpdateModal = false" />
    </tr>
</template>
  
<script>
import { useUserAuthStore } from "@/stores/authstore";
import axios from "axios";
import UpdateUserModal from "./UpdateUserModal.vue";

export default {
    name: "UserRow",
    props: {
        user: Object,
    },
    components: {
        UpdateUserModal,
    },
    data() {
        return {
            showUpdateModal: false,
            updatedUser: {
                username: this.user.username,
                email: this.user.email,
                firstName: this.user.first_name,
                lastName: this.user.last_name,
                dateOfBirth: this.user.date_of_birth,
                role: this.user.role,
                winsAgainstCPU: this.user.WinsAgainstCPU,
                lossesAgainstCPU: this.user.LossesAgainstCPU,
                tiesAgainstCPU: this.user.TiesAgainstCPU,
            },
            errorMessage: '',
        };
    },
    methods: {
        updateUserDetails(user) {
            const authStore = useUserAuthStore();
            axios.put(`http://localhost:80/users/${user.id}`, user, {
                headers: {
                    'Authorization': `Bearer ${authStore.getJwt}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    this.showUpdateModal = false;
                    this.errorMessage = '';
                    this.$emit("userUpdated", user);
                })
                .catch(error => {
                    this.errorMessage = error;
                });
        },
    },
};
</script>
  
<style scoped>
.btn {
    margin-right: 5px;
    color: white;
    border: none
}

.update {
    background-color: #f0ad4e;
}

.update:hover {
    background-color: #d9534f;
}

.create {
    background-color: #caff75;
    color: black;
}

.create:hover {
    background-color: #76b60e;
}

.btn:hover {
    color: white;
}

.modal-body input {
    margin-bottom: 10px;
    min-width: 20vw;
}
</style>