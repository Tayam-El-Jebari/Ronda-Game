<template>
    <div class="modal d-flex align-items-center justify-content-center" v-if="show" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Update User</h5>
                    <button class="btn-close" aria-label="Close" @click="closeModal"></button>
                </div>
                <div class="modal-body">
                    <label for="inputUsername">Username</label>
                    <input type="text" class="form-control" v-model="updatedUser.username" placeholder="Username">
                    <label for="inputEmail">Email address</label>
                    <input type="email" class="form-control" v-model="updatedUser.email" placeholder="Email">
                    <label for="inputFirstName">First Name</label>
                    <input type="text" class="form-control" v-model="updatedUser.first_name" placeholder="First Name">
                    <label for="inputLastName">Last Name</label>
                    <input type="text" class="form-control" v-model="updatedUser.last_name" placeholder="Last Name">
                    <label for="inputDateOfBirth">Date of Birth</label>
                    <input type="date" class="form-control" v-model="updatedUser.date_of_birth" placeholder="Date of Birth">
                    <label for="inputRole">Role</label>
                    <select class="form-control" v-model="updatedUser.role">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <label for="inputWins">Wins Against CPU</label>
                    <input type="number" min="0" class="form-control" v-model="updatedUser.WinsAgainstCPU"
                        placeholder="Wins">
                    <label for="inputLosses">Losses Against CPU</label>
                    <input type="number" min="0" class="form-control" v-model="updatedUser.LossesAgainstCPU"
                        placeholder="Losses">
                    <label for="inputTies">Ties Against CPU</label>
                    <input type="number" min="0" class="form-control" v-model="updatedUser.TiesAgainstCPU"
                        placeholder="Ties">
                    <p v-if="errorMessage">{{ errorMessage }}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
                    <button type="button" class="btn btn-primary" @click="emitUpdatedUser">Save Changes</button>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    name: "UpdateUserModal",
    props: {
        show: Boolean,
        user: Object,
    },
    data() {
        return {
            updatedUser: this.getUserCopy(),
            errorMessage: '',
        };
    },
    methods: {
        closeModal() {
            this.$emit("close");
        },
        emitUpdatedUser() {
            this.$emit("updateUser", this.updatedUser);
        },
        getUserCopy() {
            return {
                id: this.user.id,
                username: this.user.username,
                email: this.user.email,
                first_name: this.user.first_name,
                last_name: this.user.last_name,
                date_of_birth: this.user.date_of_birth,
                role: this.user.role,
                WinsAgainstCPU: this.user.winsAgainstCPU,
                LossesAgainstCPU: this.user.lossesAgainstCPU,
                TiesAgainstCPU: this.user.tiesAgainstCPU,
            };
        },
    },
    watch: {
        user: {
            deep: true,
            immediate: true,
            handler(newValue) {
                this.updatedUser = this.getUserCopy();
            }
        }
    }
};
</script>