<template>
    <div class="game-table">
        <p v-if="winner" class="winner-message waviy">
            <template v-if="winner === 'Tie'">
                <span v-for="(letter, index) in 'It\'s a tie!'" :key="index" :style="'--i:' + (index + 1)">
                    {{ letter }}
                </span>
            </template>
            <template v-else>
                <span v-for="( letter, index ) in  (winner + ' wins!') " :key="index" :style="'--i:' + (index + 1)">
                    {{ letter }}
                </span>
            </template>
        </p>
        <div class="current-player">
            Current Player: {{ players[currentPlayerIndex].name }}
        </div>
        <transition-group name="card-fly-in" tag="div" class="card-fly-in-container">
            <Player v-for="( player, index ) in  players " :key="index" :player="player" :playerIndex="index"
                @card-dragged="handleCardDragged" />
        </transition-group>
        <p>Center Board:</p>
        <div class="center-cards" @dragover.prevent @drop="handleDrop">
            <transition-group name="card-fly-in" tag="div" class="card-fly-in-container">
                <Card v-for="( card, index ) in  centerCards " :key="index" :card="card"
                    @card-clicked="captureCardHigherRank" />
            </transition-group>
        </div>
        <button @click="endTurn" class="end-turn-button">End Turn</button>
        <div v-if="isLoading">
            Loading...
        </div>
        <button v-if="!isLoading" @click="startGame">Start Game</button>
        <div v-if="rondaPlayer" class="waviyAnimation">
            <span v-for="( letter, index ) in  (rondaPlayer + '   has   Ronda!') " :key="index"
                :style="{ '--i': index + 1 }">
                {{ letter }}
            </span>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Card from './Card.vue';
import Player from './Player.vue';

const spanishDeck = [
    '2S', '3S', '4S', '5S', '6S', '7S', '0S', 'AS', 'JS', 'QS',
    '2D', '3D', '4D', '5D', '6D', '7D', '0D', 'AD', 'JD', 'QD',
    '2C', '3C', '4C', '5C', '6C', '7C', '0C', 'AC', 'JC', 'QC',
    '2H', '3H', '4H', '5H', '6H', '7H', '0H', 'AH', 'JH', 'QH',
];
const DECK_API = 'https://deckofcardsapi.com/api/deck';
const minAmountOfClicksCPU = 0;
const maxAmountOfClicksCPU = 3;



export default {
    components: {
        Card,
        Player,
    },
    data() {
        return {
            isLoading: false,
            deckId: '',
            players: [] = [
                { name: 'Player 1', cards: [], capturedCards: [] },
                { name: 'CPU', cards: [], capturedCards: [] },
            ],
            centerCards: [],
            currentPlayerIndex: 0,
            //used for keeping trying to keep track of being able to capture a card of higher rank
            lastCapturedCard: '',
            winner: '',
            remainingCards: 0,
            debts: [],
            //used for the animation, this way it's easy to know to which deck a card should go to
            targetIndexForCardAnim: 0,
            cardIdForAnim: '',
            rondaPlayer: null,
            draggedCard: null,
            draggedPlayer: null,
            
        };
    },
    methods: {
        async startGame() {
            this.isLoading = true;
            await this.resetGame();
            await this.createDeck();
            await this.dealCenterCards()
            await this.dealCards();
            this.isLoading = false;
        },
        async resetGame() {
            this.players = [
                { name: 'Player 1', cards: [], capturedCards: [] },
                { name: 'CPU', cards: [], capturedCards: [] },
            ];
            this.centerCards = [];
            this.currentPlayerIndex = 0;
            this.lastCapturedCard = '';
            this.winner = '';
            this.remainingCards = 0;
            this.debts = [];
            this.targetIndexForCardAnim = 0;
            this.cardIdForAnim = '';
            this.rondaPlayer = null;
            this.draggedCard = null;
            this.draggedPlayer = null;
        },
        async createDeck() {
            const response = await axios.get(`${DECK_API}/new/shuffle/?cards=${spanishDeck.join(',')}`);
            this.deckId = response.data.deck_id;
        },
        async shuffleDeck() {
            await axios.get(`${DECK_API}/${this.deckId}/shuffle/?remaining=true`);
        },
        async dealCards() {
            let response = null;
            for (let player of this.players) {
                response = await axios.get(`${DECK_API}/${this.deckId}/draw/?count=3`);
                player.cards = response.data.cards;
                const rondaRank = this.checkForRonda(player);
                if (rondaRank !== null) {
                    console.log("ronda!")
                    this.applyRondaLogic(player);
                }
            }
            this.remainingCards = response.data.remaining;
        },
        async dealCenterCards() {
            let isValid = false;

            while (!isValid) {
                let response = await axios.get(`${DECK_API}/${this.deckId}/draw/?count=4`);
                let cards = response.data.cards;
                isValid = this.checkCenterCardsValidity(cards);

                if (isValid) {
                    this.centerCards = cards;
                } else {
                    // Return the drawn cards to the deck
                    let cardCodes = cards.map(card => card.code).join(',');
                    await axios.post(`${DECK_API}/${this.deckId}/return/?cards=${cardCodes}`);
                    await this.shuffleDeck();
                }
            }
        },
        handleCardDragged(card, player) {
            this.draggedCard = card;
            this.draggedPlayer = player;
        },
        handleDrop(event) {
            event.preventDefault();
            this.captureOrPlaceCards(this.draggedCard, this.draggedPlayer);
            this.draggedCard = null;
            this.draggedPlayer = null;
        },

        checkCenterCardsValidity(cards) {
            const ranks = cards.map(card => this.convertToNumericValue(card.value)).sort((a, b) => a - b);

            // Check if all ranks are different
            for (let i = 1; i < ranks.length; i++) {
                if (ranks[i] === ranks[i - 1]) {
                    return false;
                }
            }

            // Check if cards are not in sequence
            for (let i = 1; i < ranks.length; i++) {
                if (ranks[i] === ranks[i - 1] + 1) {
                    return false;
                }
            }

            return true;
        },
        captureCardHigherRank(card) {
            let lastCapturedValue = this.convertToNumericValue(this.lastCapturedCard.value);
            //this is done because only cards 1-7 and 10-12 exist. Simple fix for capturing rank 10 when you have a 7
            if (lastCapturedValue == 7) {
                lastCapturedValue = 9
            }
            if (this.convertToNumericValue(card.value) == (lastCapturedValue + 1)) {
                this.handleDebtLogic([card]);
            }
        },
        captureOrPlaceCards(card, player) {
            if (player !== this.players[this.currentPlayerIndex]) {
                return;
            }
            //if you can end turn, you can't place/capture any new cards
            if (this.canEndTurn(player)) {
                return;
            }


            // Check if the clicked card can capture any card(s) from the center
            const captureCandidates = this.findCaptureCandidates(card);

            // If there are valid captures, update the game state
            if (captureCandidates.length > 0) {

                const cardsToCapture = [card, ...captureCandidates];
                this.handleDebtLogic(cardsToCapture);

                // Remove the played card from the player's hand
                player.cards = player.cards.filter(playerCard => playerCard.code !== card.code);
            }
            else {
                // add card to the center, as it is not able to capture something
                this.centerCards.push(card);
                player.cards = player.cards.filter(playerCard => playerCard.code !== card.code);
            }
        },
        handleDebtLogic(cardsToCapture) {
            for (let i = 0; i < cardsToCapture.length; i++) {
                const currentPlayerDebt = this.debts.find(debt => debt.debtor === this.currentPlayerIndex);
                if (currentPlayerDebt && currentPlayerDebt.amount > 0) {
                    this.players[currentPlayerDebt.creditor].capturedCards.push(cardsToCapture[i])
                    currentPlayerDebt.amount--;
                    this.targetIndexForCardAnim = currentPlayerDebt.creditor;
                }
                else {
                    this.players[this.currentPlayerIndex].capturedCards.push(cardsToCapture[i]);
                    this.targetIndexForCardAnim = this.currentPlayerIndex;
                }
                this.handleCardRemoval(cardsToCapture[i]);
            }
        },
        handleCardRemoval(card) {
            this.removeCardFromCenter(card)
            this.lastCapturedCard = card;
            this.checkAndApplyMissa();
        },
        checkAndApplyMissa() {
            if (this.centerCards.length === 0) {
                this.players.forEach((player, index) => {
                    if (index !== this.currentPlayerIndex) {
                        this.updateDebt(index, this.currentPlayerIndex);
                    }
                });
            }
        },
        checkForDebt(targetPlayerIndex) {
            do {
                targetPlayerIndex = (targetPlayerIndex + 1) % this.players.length;
                if (this.debts[targetPlayerIndex].amount > 0) {
                    return true;
                }
            } while (targetPlayerIndex !== currentPlayerIndex);
            return false;
        },
        nextTurn() {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
            if (this.players[this.currentPlayerIndex].name === 'CPU') {
                this.cpuTurn();
            }
            //checks if player 1 is out of cards, if so, then give 3 cards to each player
            if (this.currentPlayerIndex === 0 && this.players[this.currentPlayerIndex].cards.length === 0) {
                this.dealCards();
                this.checkForWinner();
            }
        },
        async cpuTurn() {
            const cpu = this.players[this.currentPlayerIndex];
            const randomCardIndex = Math.floor(Math.random() * cpu.cards.length);
            const selectedCard = cpu.cards[randomCardIndex];
            this.captureOrPlaceCards(selectedCard, cpu);
            // Randomly 'clicks' on center cards to see if it can capture anything; only works if there is no missa
            if (this.centerCards.length > 0) {
                const randomAmountOfClicks = Math.floor(Math.random() * (maxAmountOfClicksCPU - minAmountOfClicksCPU)) + minAmountOfClicksCPU;

                for (let i = 0; i < randomAmountOfClicks; i++) {
                    const minDelay = 500;
                    const maxDelay = 1500;
                    const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay;

                    // Wait for the random delay before executing the capture logic
                    await new Promise(resolve => setTimeout(resolve, randomDelay));

                    let randomCardIndex = Math.floor(Math.random() * this.centerCards.length);
                    this.captureCardHigherRank(this.centerCards[randomCardIndex]);
                }
            }

            this.endTurn();
        },
        removeCardFromCenter(cardToRemove) {
            this.cardIdForAnim = cardToRemove.code;
            this.centerCards = this.centerCards.filter(card => card.value !== cardToRemove.value);
        },
        findCaptureCandidates(card) {
            return this.centerCards.filter(centerCard => centerCard.value === card.value);
        },
        endTurn() {
            if (this.canEndTurn(this.players[this.currentPlayerIndex])) {
                this.nextTurn();
                this.lastCapturedCard = '';
            } else {
                alert("Current player cannot end turn without capturing a card.");
            }
        },
        checkForWinner() {
            if (this.remainingCards === 0) {
                let maxCapturedCards = -1;
                let winners = [];

                if (this.lastCapturedCard) {
                    const lastCapturingPlayer = this.players[this.currentPlayerIndex];
                    lastCapturingPlayer.capturedCards.push(...this.centerCards);
                }
                let lastCapturingPlayer = this.getLastCapturingPlayer();
                if (lastCapturingPlayer) {
                    lastCapturingPlayer.capturedCards.push(...this.centerCards);
                }

                for (const player of this.players) {
                    if (player.capturedCards.length > maxCapturedCards) {
                        maxCapturedCards = player.capturedCards.length;
                        winners = [player];
                    } else if (player.capturedCards.length === maxCapturedCards) {
                        winners.push(player);
                    }
                }

                if (winners.length === 1) {
                    this.winner = winners[0].name;
                } else {
                    this.winner = 'Tie';
                }
            }
        },
        getLastCapturingPlayer() {
            // Give the centered cards to player only if they captured a card in the last turn.
            if (this.lastCapturedCard) {
                for (const player of this.players) {
                    if (player.capturedCards.some(card => card.value === this.lastCapturedCard.value)) {
                        return player;
                    }
                }
            }
            return null;
        },
        canEndTurn(player) {
            if (player.cards.length === 3) {
                return false;
            }

            //checks if current player is last. If so, if player does not have the same amount of cards as first player, return false.
            if (this.currentPlayerIndex === this.players.length - 1) {
                if (this.players[this.currentPlayerIndex].cards.length !== this.players[0].cards.length) {
                    return false;
                }
            }
            //if player is someone else, check if they have the same amount of cards as the last player. If so return fals.
            else {
                if (player.cards.length === this.players[this.players.length - 1].cards.length) {
                    return false;
                }
            }
            return true;
        },
        convertToNumericValue(cardValue) {
            switch (cardValue) {
                case 'ACE':
                    return 1;
                case 'JACK':
                    return 11;
                case 'QUEEN':
                    return 12;
                default:
                    return parseInt(cardValue);
            }
        },
        checkForRonda(player) {
            const cardRanks = player.cards.map(card => this.convertToNumericValue(card.value));
            const uniqueRanks = [...new Set(cardRanks)];

            for (const rank of uniqueRanks) {
                if (cardRanks.filter(r => r === rank).length >= 2) {
                    return rank;
                }
            }
            return null;
        },
        applyRondaLogic(playerWithRonda) {
            const playerWithRondaIndex = this.players.indexOf(playerWithRonda);
            this.rondaPlayer = playerWithRonda.name;

            for (let i = 0; i < this.players.length; i++) {
                if (i !== playerWithRondaIndex) {
                    const otherPlayer = this.players[i];
                    if (otherPlayer.capturedCards.length > 0) {
                        const cardToTransfer = otherPlayer.capturedCards.shift();
                        playerWithRonda.capturedCards.push(cardToTransfer);
                    } else {
                        this.updateDebt(i, playerWithRondaIndex);
                    }
                }
            }
            setTimeout(() => {
                this.rondaPlayer = null;
            }, 3000);
        },
        updateDebt(debtorIndex, creditorIndex) {
            const existingDebt = this.debts.find(debt => debt.debtor === debtorIndex && debt.creditor === creditorIndex);

            if (existingDebt) {
                existingDebt.amount++;
            } else {
                this.debts.push({ debtor: debtorIndex, creditor: creditorIndex, amount: 1 });
            }
        },
        isCapturedCard() {
            if (this.players[this.targetIndexForCardAnim].capturedCards.some(capturedCard => capturedCard.code === this.cardIdForAnim)) {
                return true;
            }
            return false;
        },
    }

    //a could have explained: make a button to change the perferred way of capturing/ getting card.
    //add @card-clicked="captureOrPlaceCards" to the player.
};
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap');

.card-fly-in-enter-active {
    animation: cardFlyIn 1s ease-out forwards;
}

.waviyAnimation {
    transition: opacity 0.5s;

    position: relative;
    -webkit-box-reflect: below -20px linear-gradient(transparent, rgba(0, 0, 0, .2));
    font-size: 60px;
}

.waviyAnimation span {
    opacity: 0;
    position: relative;
    display: inline-block;
    color: #262626;
    text-transform: uppercase;
    animation: waviyAnimation 1s infinite;
    animation-delay: calc(.1s * var(--i));
}

@keyframes cardFlyIn {
    0% {
        transform: translateY(-100%);
        opacity: 0;
    }

    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes waviyAnimation {

    0% {
        transform: translateY(0);
        opacity: 0.9;
    }

    20% {
        transform: translateY(-30px);
    }

    80%,
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>