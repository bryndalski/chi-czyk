import Dice from "./dice.js";

export default class Player {
  constructor(nickname, color, connectedDiv, timer, button, gameOwner) {
    this.gameOwner = gameOwner; // kto gra => na aktualnej przeglądarce
    this.nickname = nickname; // nickname
    this.color = color; //kolor użytkownika
    this.connectedDiv = connectedDiv;
    this.timer = timer; // element timera
    this.button = button; // przcisk losowania
    this.countDownInterval = null; //
    this.dice = null; // wartość kostki
    this.ownedPawns = []; //posiadane pionki
    this.initiate();
  }
  initiate() {
    this.dice = new Dice();
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
    this.ownedPawns = pawnsArray;
    //TODO sprawdzaj czy nie doszło do skalowania podczas ruchu => jeśli tak odpal pionki na nowo bo tamte nie istnieją
  }
  //? odblokowywuje pionki
  enablePawns(who, diceValue) {
    if (
      this.nickname == who &&
      this.nickname == this.gameOwner &&
      diceValue != null
    ) {
      console.log("SIEMA");
      this.ownedPawns.forEach((index) => index.enablePawn(diceValue));
    }
  }
  //gasi pionki
  disablePawns() {
    this.ownedPawns.forEach((index) => index.clearMove());
  }

  //podpowiedzi
}
