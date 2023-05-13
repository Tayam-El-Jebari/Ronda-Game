<template>
    <section class="main-content">
      <div class="game-image-container">
        <img src="img/pic798234.webp" alt="Ronda Game" class="game-image" />
      </div>
      <div class="game-description">
        <h2>About Ronda</h2>
        <p>
          Ronda is a popular card game played in Morocco. The game is played
          with a deck of 40 Spanish cards and involves capturing cards by
          matching them with the cards in hand.
        </p>
        <h3>Rules</h3>
        <ol>
          <li>Each player is dealt three cards.</li>
          <li>
            The goal is to capture cards from the center by matching them with
            the cards in hand.
          </li>
          <li>Points are awarded for each captured card.</li>
          <li>The player with the most points at the end wins.</li>
        </ol>
        <div class="bold-text">
          <p>
            Please note that you must <strong>login</strong> or <strong>register</strong> to
            play the game.
          </p>
        </div>
        <button @click="playGame" class="play-game-btn">Play Ronda</button>
      </div>
  </section>
</template>

<script>
export default {
  name: "Home",
};
</script>

<style scoped>
.homepage {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #4a4a4a;
}

.header h1 {
  color: #ffffff;
  margin: 0;
}

.nav button {
  margin-left: 1rem;
  background-color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.game-image-container {
  display: flex;
  justify-content: center;
}

.game-image {
  max-width: 700px;
  max-height: 100%;
}

.game-description {
  padding: 1rem;
}

.bold-text {
  font-weight: bold;
  color: red;
  padding: 0.5rem 0;
}

.play-game-btn {
  background-color: #4a4a4a;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}
.play-game-btn:hover {
background-color: #6a6a6a;
}
</style>