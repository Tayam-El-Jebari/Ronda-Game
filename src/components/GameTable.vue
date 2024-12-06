<template>
    <section class=" vh-100 d-flex justify-content-center align-items-center">
        <div class="game-table">
            <p v-if="winner" class="winner-message waviyAnimation">
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
                    :isOpposingPlayer="setOpposingPlayer(player.name)" @card-dragged="handleCardDragged"
                   />
            </transition-group>
            <p>Center Board:</p>
            <div class="center-cards rounded-5" @dragover.prevent @drop="handleDrop">
                <transition-group name="card-fly-in" tag="div" class="card-fly-in-container">
                    <Card v-for="( card, index ) in  centerCards " :key="index" :card="card"
                        @card-clicked="captureCardHigherRank" />
                </transition-group>
            </div>
            <p class="disclaimer"><small>*click and drag cards from your hand to center to place cards<br>
                    *click on cards in center to capture those of a higher rank, as long as it is in sequence</small></p>
            <button @click="endTurn" v-if="gameStarted" class="end-turn-button btn btn-primary mb-5">End Turn</button>
            <div v-if="isLoading">
                Loading...
            </div>
            <button v-if="!isLoading && !gameStarted" @click="startGame" class="btn btn-primary mb-5">{{ buttonText
            }}</button>
            <div v-if="rondaPlayer" class="waviyAnimation">
                <span v-for="( letter, index ) in  (rondaPlayer + '   has   Ronda!') " :key="index"
                    :style="{ '--i': index + 1 }">
                    {{ letter }}
                </span>
            </div>
        </div>
    </section>
</template>

<script>
import axios from 'axios';
import Card from './Card.vue';
import Player from './Player.vue';
import { useUserAuthStore } from "@/stores/authstore";

//only cards used for playing ronda. 40 cards, 4 suits, 10 cards per suit
const spanishDeck = [
    '2S', '3S', '4S', '5S', '6S', '7S', '0S', 'AS', 'JS', 'QS',
    '2D', '3D', '4D', '5D', '6D', '7D', '0D', 'AD', 'JD', 'QD',
    '2C', '3C', '4C', '5C', '6C', '7C', '0C', 'AC', 'JC', 'QC',
    '2H', '3H', '4H', '5H', '6H', '7H', '0H', 'AH', 'JH', 'QH',
];
const DECK_API = 'https://deckofcardsapi.com/api/deck';

//could have, change the difficulty of the cpu.
//done by changing the min and max amount of random clicks the cpu can make
//higher difficulty = higher amount of clicks = everything that is possible to be cleared on the board will be cleared each turn. CPU won't miss out.
const minAmountOfClicksCPU = 1;
const maxAmountOfClicksCPU = 6;



export default {
    components: {
        Card,
        Player,
    },
    computed: {
        buttonText() {
            return this.winner ? 'Restart Game' : 'Start Game';
        }
    },
    created() {
        //could have: save game state to server, load from server
        this.loadGameState();
        console.log(this.players);
    },
    data() {
        return {
            isLoading: false,
            deckId: '',
            //array here. Mainly done so the project can be easily scaled up by introducing more players into the game
            players: [] = [
                //could be seen as 'gameslots', see claimGameSlot() for more info
                { name: 'Player 1', cards: [], capturedCards: [] },
                { name: 'CPU', cards: [], capturedCards: [] },
            ],
            centerCards: [],
            dealingCards: false,
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
            gameStarted: false,

        };
    },
    methods: {
        async startGame() {
            //loading added as creating a deck and dealing cards takes a while, as multiple conditions have to be met to deal cards on center
            this.isLoading = true;
            await this.resetGame();
            await this.createDeck();
            await this.dealCenterCards()
            await this.dealCards();
            this.isLoading = false;
            this.gameStarted = true;
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
            this.gameStarted = false;
        },
        async createDeck() {
            const response = await axios.get(`${DECK_API}/new/shuffle/?cards=${spanishDeck.join(',')}`);
            this.deckId = response.data.deck_id;
        },
        async shuffleDeck() {
            await axios.get(`${DECK_API}/${this.deckId}/shuffle/?remaining=true`);
        },
        async dealCards() {
            //done because loops and setTimeout (from CPU turn) don't work well together, if at all from debugging i noticed
            //this will make sure that the cards are dealt only once to all players, alternatively, could have changed the logic of cpu turn to not use loops
            if (this.dealingCards == true) {
                return;
            }
            this.dealingCards = true;

            let response = null;
            for (let player of this.players) {
                response = await axios.get(`${DECK_API}/${this.deckId}/draw/?count=3`);
                player.cards = response.data.cards;
                const rondaRank = this.checkForRonda(player);
                if (rondaRank !== null) {
                    this.applyRondaLogic(player);
                }
            }
            this.dealingCards = false;
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
        setOpposingPlayer($username) {
            //not best solution, but needed to assign current player to the correct slot
            let currentLoggedInUsername = this.claimGameSlot();
            if (currentLoggedInUsername === $username) {
                return false;
            }
            return true;
        },
        claimGameSlot() {
            const authStore = useUserAuthStore();
            //FOR MULTIPLAYER:
            //this would need to be changed to seeing which 'slot' is available, 
            //looping through the currently logged in users, and if it is available, set it to that slot
            this.players[0].name = authStore.getUsername;
            return this.players[0].name
        },
        saveGameState() {
            //only called upon when ending your turn.
            const gameState = {
                deckId: this.deckId,
                players: this.players,
                centerCards: this.centerCards,
                currentPlayerIndex: this.currentPlayerIndex,
                lastCapturedCard: this.lastCapturedCard,
                winner: this.winner,
                remainingCards: this.remainingCards,
                debts: this.debts,
                targetIndexForCardAnim: this.targetIndexForCardAnim,
                cardIdForAnim: this.cardIdForAnim,
                rondaPlayer: this.rondaPlayer,
                draggedCard: this.draggedCard,
                draggedPlayer: this.draggedPlayer,
                gameStarted: this.gameStarted,
            };
            // save locally
            localStorage.setItem('gameState', JSON.stringify(gameState));
        },
        loadGameState() {
            let gameState = localStorage.getItem('gameState');

            if (gameState) {
                gameState = JSON.parse(gameState);
                Object.assign(this.$data, gameState);
            }
        },
        handleCardDragged(card, player) {
            this.draggedCard = card;
            this.draggedPlayer = player;
        },
        handleDrop(event) {
            event.preventDefault();
            this.captureOrPlaceCards(this.draggedCard, this.draggedPlayer);
            //resets the dragged card and player
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
            //checks if the user should end their turn, if so, don't do anything
            if (this.canEndTurn(player)) {
                return;
            }


            // Check if the dragged card can capture any card(s) from the center
            const captureCandidates = this.findCaptureCandidates(card);

            // If there are valid captures, update the game state
            if (captureCandidates.length > 0) {

                const cardsToCapture = [card, ...captureCandidates];
                // Remove the played card from the player's hand
                player.cards = player.cards.filter(playerCard => playerCard.code !== card.code);

                this.handleDebtLogic(cardsToCapture);
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
                    //for the animation, we need to know who the creditor is, so we can animate the card to them
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
        async nextTurn() {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
            if (this.players[this.currentPlayerIndex].name === 'CPU') {
                this.cpuTurn();
            }
            //checks if player 1 is out of cards, if so, then give 3 cards to each player
            if (this.currentPlayerIndex === 0 && this.players[this.currentPlayerIndex].cards.length === 0) {
                await this.dealCards();
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
                //random delay for making it seem more human
                for (let i = 0; i < randomAmountOfClicks; i++) {
                    const minDelay = 100;
                    const maxDelay = 500;
                    const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay;

                    // Wait for the random delay before executing the capture logic
                    await new Promise(resolve => setTimeout(resolve, randomDelay));

                    let randomCardIndex = Math.floor(Math.random() * this.centerCards.length);
                    this.captureCardHigherRank(this.centerCards[randomCardIndex]);
                }
            }
            //end turn of cpu
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
            //checks if user or cpu can end turn
            if (this.canEndTurn(this.players[this.currentPlayerIndex])) {
                this.nextTurn();
                this.lastCapturedCard = '';
                this.saveGameState();
            } else {
                alert("Current player cannot end turn without capturing a card.");
            }
        },
        checkForWinner() {
            const noCardsInHands = this.players.every(player => player.cards && player.cards.length === 3);
            if (this.remainingCards === 0 && noCardsInHands) {
                let maxCapturedCards = -1;
                let winners = [];

                if (this.lastCapturedCard) {
                    const lastCapturingPlayer = this.players[this.currentPlayerIndex];
                    lastCapturingPlayer.capturedCards.push(...this.centerCards);
                }
                this.giveLastCapturingPlayerCenterCards();
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
                localStorage.removeItem('gameState');
                this.gameStarted = false;
                this.updateStatistics();
            }
        },
        updateStatistics() {
            const authStore = useUserAuthStore();

            let endpoint;
            if (this.winner === 'Tie') {
                endpoint = '/users/addTie';
            } else if (this.winner === authStore.getUsername) {
                endpoint = '/users/addWin';
            } else {
                endpoint = '/users/addLoss';
            }

            try {
                const response = axios.post(`http://localhost:80${endpoint}`, null, {
                    headers: {
                        'Authorization': `Bearer ${authStore.getJwt}`,
                        'Content-Type': 'application/json'
                    }
                });
            } catch (error) {
                console.error(error);
            }
        },
        giveLastCapturingPlayerCenterCards() {
            //if someone captured a card in the last turn, give them all the center cards
            let lastCapturingPlayer = this.getLastCapturingPlayer();
            if (lastCapturingPlayer) {
                lastCapturingPlayer.capturedCards.push(...this.centerCards);
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
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap');

body {
    background-color: #9aadb8;
}

.center-cards {
    min-height: 5vh !important;
    min-width: 100%;
    background-color: #5b6b7a;
    border-radius: 10px;
}

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

.disclaimer {
    font-size: 14px;
    color: #262626;
    text-align: left;
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

@media (max-width: 676px) {
    .center-cards {
        min-width: auto;
    }

    .disclaimer {
        font-size: 11px;
        color: #262626;
        text-align: left;
    }
}</style>