<template>
  <div class="vh-100 ronda-container d-flex justify-content-center align-items-center">
    <h1>RONDA</h1>
    <h2 class="text-information text-center text-white mb-5">THE CARD GAME</h2>
    <div class="links d-flex">
      <h3 class="me-4"><a class="link" href="/login">login</a></h3>
      <h3 class="me-4"><a class="link" href="/register">register</a></h3>
      <h3 class="me-4"><a class="link" href="/gameTables">play game</a></h3>
      <h3 class="me-4"><a class="link" href="#">rules</a></h3>
    </div>
  </div>
  <div class="second-container-home d-flex align-items-center m-5">
    <div class="text-information">
      <h2 class="">Dive into the captivating world of Ronda, a thrilling card game where<br> you might even win money!
      </h2>
      <small>
        <sup>*</sup>Disclaimer: While the prospect of winning money might sound exciting, we would like to clarify that
        any monetary rewards, wealth, fortune, or stacks of cash that may or may not appear in your possession have
        absolutely no correlation with our platform or services.

        The hypothetical scenario of you becoming wealthier due to our game exists in the same realm where unicorns roam
        freely, where you might spontaneously develop the ability to breathe underwater, or where a billionaire decides to
        drop bags of money on your doorstep for no apparent reason.

        In other words, the likelihood of these events happening does not increase nor decrease due to your involvement
        with our services. If you, by any chance, come to believe otherwise (perhaps due to a sudden windfall coinciding
        with your time spent on our platform), it would be a pure coincidence, much like winning a lottery ticket the day
        after you found a four-leaf clover.

        We hereby disclaim all responsibility for any sudden or unexpected changes to your financial status, whether
        positive or negative, and strongly urge all users to not harbor any illusions or fantasies regarding striking it
        rich while using our services. After all, you'd have a better chance of getting struck by lightning while riding a
        unicorn during a solar eclipse.

        Remember, the true riches lie in the joy of the game itself. Have fun, play safe, and leave the money-making to
        your day job (or a generous billionaire, if you're so lucky).
      </small>
    </div>
    <div class="img ml-auto" alt="wow.png"></div>
  </div>
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

.second-container-home {
  height: 80vh;
  background-color: #293241
}

.second-container-home h2 {
  font-size: 50px;
  font-family: 'instrument Serif';
  color: white;
  margin-left: 50px;
  font-weight: 300;
}

.second-container-home small {
  color: white;
  margin-left: 50px;
  font-weight: 300;
  font-size: 10px;
  overflow:hidden;

}


.img {
  background-image: url("../assets/img/home/wow.jpg");
  height: 100%;
  width: 100%;
}

.text-information {
  flex-direction: column;
  width: 70%;
  overflow:hidden;

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

.ronda-container {
  position: relative;

  margin-top: 0px;
  background-color: #3d5a8077;
  flex-direction: column;
}

.link {
  color: #ffffff !important;
  text-decoration-line: underline;
}

.link:hover {
  color: #444343 !important;
}

.ronda-container::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80%;
  height: 80%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
}

.ronda-container h1 {
  font-family: 'instrument Serif';
  font-weight: normal;
  line-height: 1.1em;
  color: white;
  text-align: center;
  width: auto;
  font-size: 20vw;
  transform: uppercase;
}
.ronda-container h2{
  font-family: 'instrument Serif';

}

.links {
  flex-direction: row;
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
@media (max-width:801px)
{
  .second-container-home{
    flex-direction: column;
    overflow:hidden;
  }
  .ronda-container h2{
    display:none;
  }
  .ronda-container::before {
  width: 100%;
  height: 55%;
}
  .text-information{
    overflow:hidden;
    width:100%;
    height:100%
  }
}
</style>