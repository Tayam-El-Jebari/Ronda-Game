<template>
    <div class="modal d-flex align-items-center justify-content-center" v-if="show" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Delete User</h5>
                    <button class="btn-close" aria-label="Close" @click="closeModal"></button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete user {{ user.username }}?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
                    <button type="button" class="btn btn-danger" @click="emitDeleteUser">Delete</button>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    name: "DeleteUserModal",
    props: {
        show: Boolean,
        user: Object,
    },
    methods: {
        closeModal() {
            this.$emit("close");
        },
        emitDeleteUser() {
            this.$emit("deleteUser", this.user);
        },
    }
};
</script>