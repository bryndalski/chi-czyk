import Dice from "./dice.js";

export default class Player {
  constructor(nickname, color, connectedDiv, timer, button, gameOwner) {
    this.gameOwner = gameOwner;
    this.nickname = nickname;
    this.color = color;
    this.connectedDiv = connectedDiv;
    this.timer = timer;
    this.button = button;
    this.pawnsOnbord = {};
    this.pawnsOnSpawn = 4;
    this.countDownInterval = null;
    this.dice = null;
    this.ownedPawns = [];
    this.initiate();
  }
  initiate() {
    this.dice = new Dice();
    console.log(this.dice);
  }
  //getters
  get getNick() {
    return this.nickname;
  }

  //methods
  //DICE
  //*zezwala na kostkę
  enebleDice(who, diceValue) {
    if (
      this.nickname == who &&
      this.nickname == this.gameOwner &&
      diceValue == null
    ) {
      this.button.style.visibility = "visible";
      this.timer.style.visibility = "visible";
      this.button.style.borderColor = this.color;
      this.button.addEventListener("click", this.throwDice);
    } else {
      this.button.style.visibility = "hidden";
      this.timer.style.visibility = "hidden";
      this.button.addEventListener("click", this.throwDice);
    }
  }
  //* wyłącza kostkę
  disableDice() {
    this.button.style.visibility = "hidden";
    this.button.removeEventListener("click", this.throwDice);
  }
  //*rzuca i wyłącza kostkę
  throwDice = () => {
    this.dice.throwDice();
    this.disableDice();
  };
  //* ustawia czas
  setTime(time) {
    this.timer.style.visibility = "visible";
    this.timer.innerText = time;
    if (time == 0) {
      this.button.style.visibility = "hidden";
      this.timer.style.visibility = "hidden";
    }
  }
  //PIONKI
  //?Pobiera pionki
  newPawns(pawnsArray) {
      this.ownedPawns = pawnsArray
      //TODO sprawdzaj czy nie doszło do skalowania podczas ruchu => jeśli tak odpal pionki na nowo bo tamte nie istnieją
  }

  //podpowiedzi
}
