<template>
  <div class="vh-100 ronda-container d-flex justify-content-center align-items-center">
    <h1>RONDA</h1>
    <h2 class="text-information text-center text-white mb-5">THE CARD GAME</h2>
    <div class="links d-flex">
      <h3 class="me-4"><a class="link" href="/login">login</a></h3>
      <h3 class="me-4"><a class="link" href="/register">register</a></h3>
      <h3 class="me-4"><a class="link" href="/gameTables">play game</a></h3>
      <h3 class="me-4"><a class="link" href="#rules">rules</a></h3>
    </div>
  </div>
  <div v-if="isAuthenticated" class="container d-flex justify-content-center align-items-center w-100 mt-5 text-center">
    <div class="row w-100">
      <div class="col">
        <h3>Wins CPU: <br>{{ statsAgainstCpu.winsAgainstCPU }}</h3>
      </div>
      <div class="col">
        <h3>Ties CPU:<br>{{ statsAgainstCpu.tiesAgainstCPU }}</h3>
      </div>
      <div class="col">
        <h3>Loses CPU: <br>{{ statsAgainstCpu.lossesAgainstCPU }}</h3>
      </div>
    </div>
  </div>
  <div class="second-container-home d-flex align-items-center m-5">
    <div class="text-information">
      <h2 class="">Dive into the captivating world of Ronda, a thrilling card game where<br> you might even win money!
      </h2>
      <p class="m-5">
        <small>
          <sup>*</sup>Disclaimer: While the prospect of winning money might sound exciting, we would like to clarify that
          any monetary rewards, wealth, fortune, or stacks of cash that may or may not appear in your possession have
          absolutely no correlation with our platform or services.

          The hypothetical scenario of you becoming wealthier due to our game exists in the same realm where unicorns roam
          freely, where you might spontaneously develop the ability to breathe underwater, or where a billionaire decides
          to
          drop bags of money on your doorstep for no apparent reason.

          In other words, the likelihood of these events happening does not increase nor decrease due to your involvement
          with our services. If you, by any chance, come to believe otherwise (perhaps due to a sudden windfall coinciding
          with your time spent on our platform), it would be a pure coincidence, much like winning a lottery ticket the
          day
          after you found a four-leaf clover.

          We hereby disclaim all responsibility for any sudden or unexpected changes to your financial status, whether
          positive or negative, and strongly urge all users to not harbor any illusions or fantasies regarding striking it
          rich while using our services. After all, you'd have a better chance of getting struck by lightning while riding
          a
          unicorn during a solar eclipse.

          Remember, the true riches lie in the joy of the game itself. Have fun, play safe, and leave the money-making to
          your day job (or a generous billionaire, if you're so lucky).
        </small>
      </p>
    </div>
    <div class="img ml-auto" alt="wow.png"></div>
  </div>
  <div class="d-flex justify-content-center align-items-center">
    <section class="main-content container m-5 p-0" id="rules">
      <div class="card">
        <div class="card-header">
          <h3>Ronda Game Rules</h3>
        </div>
        <div class="card-body">
          <div class="accordion" id="rondaRulesAccordion">
            <div class="card">
              <div id="capturingCards" class="collapse show" aria-labelledby="capturingCardsHeader"
                data-bs-parent="#rondaRulesAccordion">
                <div class="card-body">
                  <p class="card-text"><strong>Ronda is all about capturing cards</strong><br><br>
                    You can capture cards in two ways: <br>
                    Capturing by placing a card which is equal in rank to a card on the table. <br>
                    Capturing cards which are of a higher rank, but are in a sequence to the pair you just had. For
                    example;
                    you pair two 5s, you may pick up 6,7,10,11 and 12, in that specific order.<br>
                  </p>
                </div>
              </div>
            </div>
            <div class="card mt-3">
              <div id="capturingCards" class="collapse show" aria-labelledby="capturingCardsHeader"
                data-bs-parent="#rondaRulesAccordion">
                <div class="card-body">
                  <p class="card-text"><strong>You can also earn cards in a few specific scenario's. For
                      example;</strong><br><br>
                    get 1 card from each player if you get missa<br>
                    get 1 card from each player if you get Ronda.<br><br>
                    Ronda is when you have two of the same card rank in your hand.<br>
                    If two players have ronda, the one to recieve the card would need to have the highest rank.<br>
                    Both players got the rank? Nothing happends<br><br>
                    Missa is when you clear the board.
                  </p>
                </div>
              </div>
            </div>
            <div class="card mt-3">
              <div id="capturingCards" class="collapse show" aria-labelledby="capturingCardsHeader"
                data-bs-parent="#rondaRulesAccordion">
                <div class="card-body">
                  <p class="card-text"><strong>Other practical rules;</strong><br><br>
                    At the first time, there shoudn't be two cards of a same number on the table.<br><br>
                    Ronda plays with 40 cards of ranks 1 to 7, and 10 to 12, this version uses a normal card deck, that
                    has 4 suits, 10 cards per suit.<br>
                    Ace equals 1, jack equals 11, and the queen equals 12<br><br>
                    Last player to capture a card in last turn gets all the cards in the center when the game is over (all 40 cards are
                    played).<br><br>
                    This version has no Este.
                  </p>
                </div>
              </div>
            </div>
            <div class="card mt-3">
              <div id="capturingCards" class="collapse show" aria-labelledby="capturingCardsHeader"
                data-bs-parent="#rondaRulesAccordion">
                <div class="card-body">
                  <p class="card-text">There are some other rules in Ronda that sometimes get applied, like for example
                    Este (get a bonus card from an opponent if you get the card immediately after they got it), but these
                    we're the rules i played the game with when i was a child, so i chose to only code these rules.
                  </p>
                </div>
              </div>
            </div>
            <p class="text-center mt-4">Have Fun!</p>

          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { useUserAuthStore } from "@/stores/authstore";
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      statsAgainstCpu: {
        winsAgainstCPU: "Loading...",
        lossesAgainstCPU: "Loading...",
        tiesAgainstCPU: "Loading..."
      }
    };
  },
  computed: {
    isAuthenticated() {
      return useUserAuthStore().isAuthenticated;
    },
    userId() {
      return useUserAuthStore().getuserId;
    },
    jwt() {
      return useUserAuthStore().getJwt;
    }
  },
  created() {
    this.getStatsAgainstCpu();
  },
  methods: {
    getStatsAgainstCpu() {
      if (this.isAuthenticated) {
        axios.get(`http://localhost:80/users/statsCpu/${this.userId}`, {
          headers: {
            'Authorization': `Bearer ${this.jwt}`
          }
        })
        .then((response) => {
          this.statsAgainstCpu = response.data;
        })
        .catch((error) => {
          this.statsAgainstCpu = {
            winsAgainstCPU: "",
            lossesAgainstCPU: "",
            tiesAgainstCPU: "Failed to retrieve data"
          };
          console.log(error);
        });
      }
    }
  }
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
  overflow: hidden;

}


.img {
  background-image: url("../assets/img/home/wow.jpg");
  height: 100%;
  width: 100%;
}

.text-information {
  flex-direction: column;
  width: 70%;
  overflow: hidden;

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

.ronda-container h2 {
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

.card-header {
  background-color: #293241;
  color: white;
}

.play-game-btn:hover {
  background-color: #6a6a6a;
}

@media (max-width: 1200px) {
  .second-container-home {
    display: none !important;
  }
}

@media (max-width:801px) {
  .second-container-home {
    flex-direction: column;
    overflow: hidden;
    display: none;
  }

  .ronda-container h2 {
    display: none;
  }

  .ronda-container::before {
    width: 100%;
    height: 55%;
  }


  .img {
    background: url("../assets/img/home/wow.jpg") no-repeat left center;
  }
}</style>