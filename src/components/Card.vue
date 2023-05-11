<template>
  <div class="card" :class="{ 'captured-card': captured }" :id="card.code" @click="handleCardClick">
    <img :src="card.image" />
  </div>
</template>

<script>
export default {
  props: {
    card: Object,
    captured: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleCardClick() {
      this.$emit('card-clicked', this.card);
    },
  },
};
</script>
  
<style scoped>
.card {
    width: 80px;
    height: 120px;
    border: 0px;
    border-radius: 0px;
}
.captured-card img{
  opacity:0.4;
  bottom: 1px;
    top: -1;
    right: 0px;
    left: 1px;
}
</style>