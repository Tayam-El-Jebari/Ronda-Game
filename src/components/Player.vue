<template>
    <div class="player">
        <div class="player-name">{{ player.name }}</div>
        <div class="player-cards-box">
            <div class="player-cards">
                <transition-group name="player-card-fly-in" tag="div" class="player-cards">
                    <Card v-for="(card, index) in player.cards" :key="index" :card="card"
                        draggable="true" @dragstart="handleDragStart($event, card, player)"  @dragend="handleCardDragEnd" />
                </transition-group>

            </div>
        </div>
        <p>Captured cards: </p>
        <div class="captured-cards-container" :id="`captured-cards-container-${playerIndex}`">
            <div class="captured-cards-count">{{ player.capturedCards.length }}</div>
            <div class="captured-cards">
                <Card v-for="(card, index) in player.capturedCards" :key="index" :card="card" :captured="true" />
            </div>
        </div>

    </div>
</template>
  
<script>
import Card from './Card.vue';

export default {
    components: {
        Card,
    },
    props: {
        player: Object,
        playerIndex: {
            type: Number,
            required: true
        }
    },
    methods: {
        //could have, make a button to change the perferred way of capturing/ getting card. @card-clicked="handleCardClicked" needs to be added to template
        // handleCardClicked(card) {
        //     this.$emit('card-clicked', card, this.player);
        // },
        handleDragStart(event, card, player) {
            event.dataTransfer.effectAllowed = "move";
            this.$emit('card-dragged', card, player);
        },
    },
};
</script>
<style scoped>
.captured-cards-container {
    position: relative;
    display: inline-block;
    margin-left: 10px;
}

.player-cards-box {
    width: 240px;
}

.player-cards {
    position: relative;
    height: 120px;
    justify-content: center;
}

.player-cards .card {
    position: absolute;
    transition: transform 800ms cubic-bezier(.04, .8, .04, .89);
}

.player-cards>*:nth-child(1) {
    transform: translateX(-10%) rotate(-1deg);
}

.player-cards>*:nth-child(2) {
    transform: rotate(2deg);
}

.player-cards>*:nth-child(3) {
    transform: translateX(-6%) rotate(-3deg);
}

.player-cards:hover>*:nth-child(1) {
    transform: translate(-80%) rotate(-20deg);
}

.player-cards:hover>*:nth-child(2) {
    transform: translate(0) rotate(20deg);
}

.player-cards:hover>*:nth-child(3) {
    transform: translate(80%, 35%) rotate(40deg);
}



.captured-cards-count {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 36px;
    font-weight: bold;
    color: white;
    border: 2px;
    text-shadow: 5px 5px 7px rgba(0, 0, 0, 0.5);
    z-index: 1;
    -webkit-text-stroke: 1px #000000;
}

.captured-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    width: 80px;
    height: 120px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    overflow: hidden;

}
</style>