<template>
  <div class="card" :class="{ 'captured-card': captured }" :id="card.code" @click="handleCardClick">
    <img v-if="shouldBeVisible" :src="card.image" />
    <img v-else src="\src\assets\img\gameTable\back-side-card.png" />
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
    //for the card back image
    //default is true for the center cards
    shouldBeVisible: {
      type: Boolean,
      default: true
    }
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
    background-color: rgba(0,0,0,0) !important;
}
.captured-card img{
  opacity:0.4;
  bottom: 1px;
    top: -1;
    right: 0px;
    left: 1px;
}
</style>