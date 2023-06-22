<template>
    <div class="table-responsive">
        <p v-if="errorMessage" class="alert alert-danger" id="error-message">{{ errorMessage }}</p>
        <table class="table table-striped table-hover">
            <thead class="thead-dark">
                <tr>
                    <th scope="col">Username</th>
                    <th scope="col">Email</th>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Date of Birth</th>
                    <th scope="col">Role</th>
                    <th scope="col">Wins Against CPU</th>
                    <th scope="col">Losses Against CPU</th>
                    <th scope="col">Ties Against CPU</th>
                </tr>
            </thead>
            <tbody>
                <UserRow v-for="user in users" :key="user.id" :user="user" @userUpdated="updateUser"
                    @userDeleted="deleteUser" @updateError="handleUpdateError" />
            </tbody>
        </table>
    </div>
</template>
    
<script>
import UserRow from "./UserRow.vue";

export default {
    name: "UserTable",
    components: {
        UserRow,
    },
    props: {
        users: Array,
    },
    data() {
        return {
            errorMessage: '',
        }
    },
    methods: {
        updateUser(user) {
            this.$emit("updateUser", user);
        },
        deleteUser(user) {
            this.$emit("deleteUser", user);
        },
        handleUpdateError(errorMessage) {
            this.errorMessage = errorMessage;
        },
    },
};
</script>
<style scoped>
.table-responsive {
    margin-top: 20px;
}

.alert {
    min-height: 0px;
}
</style>